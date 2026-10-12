import { NextResponse } from 'next/server';
import { 
  getLiveArticlesCollection, 
  saveRealArticle, 
  deleteArticle, 
  purgeAllDummyArticles, 
  getArticlesMeta,
  getRealArticles 
} from '@/lib/articles/manager';

export async function GET() {
  try {
    const articles = await getLiveArticlesCollection();
    const realArticles = await getRealArticles();
    const meta = getArticlesMeta();

    return NextResponse.json({
      success: true,
      articles,
      realCount: realArticles.length,
      dummyCount: meta.isDummyPurged ? 0 : Math.max(0, articles.length - realArticles.length),
      isDummyPurged: meta.isDummyPurged
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title || !body.categorySlug) {
      return NextResponse.json(
        { error: 'Title and category are required to publish an article.' },
        { status: 400 }
      );
    }

    const saved = await saveRealArticle(body);

    return NextResponse.json({
      success: true,
      article: saved,
      message: `Article "${saved.title}" published live.`
    });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'purge_dummy') {
      const res = await purgeAllDummyArticles();
      return NextResponse.json(res);
    }

    if (id) {
      const res = await deleteArticle(id);
      return NextResponse.json({
        success: true,
        message: `Article ${id} deleted successfully.`
      });
    }

    return NextResponse.json(
      { error: 'Specify an article id or action=purge_dummy' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
}
