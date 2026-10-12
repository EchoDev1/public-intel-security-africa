import { NextResponse } from 'next/server';
import { 
  getThreatMatrixData, 
  saveThreatMatrixData, 
  syncThreatMatrixWithLiveSources 
} from '@/lib/threatMatrix/manager';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const data = await getThreatMatrixData();

    // Check if auto-sync is needed (older than 60 minutes and enabled)
    const lastSync = data.lastSyncTimestamp ? new Date(data.lastSyncTimestamp).getTime() : 0;
    const now = Date.now();
    const needsSync = data.isAutoSyncEnabled !== false && (now - lastSync > 60 * 60 * 1000);

    if (needsSync) {
      // Fire async sync without delaying the response
      syncThreatMatrixWithLiveSources().catch(err => console.error('Threat matrix background sync notice:', err.message));
    }

    return NextResponse.json({
      success: true,
      ...data
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. Instant Automated Synchronization from Live Sources
    if (action === 'sync_now') {
      const updated = await syncThreatMatrixWithLiveSources();
      return NextResponse.json({
        success: true,
        message: 'Threat Matrix updated from live UN Peace & Security and Global Conflict feeds.',
        data: updated
      });
    }

    // 2. Save full Threat Matrix from Admin
    if (action === 'save_all') {
      const { sectors, continentalThreatLevel, isAutoSyncEnabled, breakingAlerts } = body;
      const current = await getThreatMatrixData();
      const updated = await saveThreatMatrixData({
        ...current,
        sectors: sectors || current.sectors,
        continentalThreatLevel: continentalThreatLevel || current.continentalThreatLevel,
        breakingAlerts: breakingAlerts || current.breakingAlerts,
        isAutoSyncEnabled: typeof isAutoSyncEnabled === 'boolean' ? isAutoSyncEnabled : current.isAutoSyncEnabled,
        lastSyncSource: 'Lady Dakore Ekpendu (Executive Directive)',
        lastSyncTimestamp: new Date().toISOString()
      });
      return NextResponse.json({
        success: true,
        message: 'Threat Matrix configuration saved successfully.',
        data: updated
      });
    }

    // 3. Update single sector
    if (action === 'update_sector') {
      const { index, sector } = body;
      const current = await getThreatMatrixData();
      const updatedSectors = [...current.sectors];
      if (typeof index === 'number' && index >= 0 && index < updatedSectors.length) {
        updatedSectors[index] = {
          ...updatedSectors[index],
          ...sector,
          manualLock: true, // Mark locked so automated sync doesn't overwrite admin's manual notes
          lastUpdated: 'Updated just now (Manual Override)'
        };
        const updated = await saveThreatMatrixData({
          ...current,
          sectors: updatedSectors,
          lastSyncSource: 'Admin Editorial Override'
        });
        return NextResponse.json({
          success: true,
          message: `Sector "${sector.region}" updated and locked.`,
          data: updated
        });
      }
      return NextResponse.json({ success: false, error: 'Invalid sector index' }, { status: 400 });
    }

    // 4. Toggle automated sync
    if (action === 'toggle_auto_sync') {
      const { isAutoSyncEnabled } = body;
      const current = await getThreatMatrixData();
      const updated = await saveThreatMatrixData({
        ...current,
        isAutoSyncEnabled: !!isAutoSyncEnabled
      });
      return NextResponse.json({
        success: true,
        message: `Automated live feed synchronization set to ${isAutoSyncEnabled ? 'ENABLED' : 'PAUSED'}.`,
        data: updated
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
