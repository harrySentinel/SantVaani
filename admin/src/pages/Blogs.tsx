import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase, TABLES } from '@/lib/supabase'
import BlogForm from '@/components/BlogForm'
import { Edit, Trash2, Eye, Plus, FileText } from 'lucide-react'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { ResponsiveTable } from '@/components/ui/responsive-table'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { EmptyState } from '@/components/ui/empty-state'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: string
  tags: string[]
  reading_time: number
  featured: boolean
  featured_image?: string
  spiritual_quotes?: string[]
  related_saints?: string[]
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  status: 'draft' | 'published'
  published_at?: string
  view_count: number
  blog_categories?: {
    name: string
    icon: string
    color: string
  }
}

export default function Blogs() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from(TABLES.BLOG_POSTS)
        .select(`
          *,
          blog_categories (
            name,
            icon,
            color
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error: any) {
      console.error('Error loading posts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load blog posts',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const { error } = await supabase
        .from(TABLES.BLOG_POSTS)
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Blog post deleted successfully'
      })
      loadPosts()
    } catch (error: any) {
      console.error('Error deleting post:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive'
      })
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedPost(null)
  }

  const handleFormSave = () => {
    loadPosts()
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (post: BlogPost) => (
        <div className="space-y-1">
          <div className="font-medium">{post.title}</div>
          <div className="text-xs text-gray-500">/{post.slug}</div>
          {post.blog_categories && (
            <Badge variant="outline" className="text-xs">
              {post.blog_categories.icon} {post.blog_categories.name}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (post: BlogPost) => (
        <div className="space-y-1">
          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
            {post.status}
          </Badge>
          {post.featured && (
            <Badge variant="outline" className="ml-1">✨ Featured</Badge>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {post.view_count} views
          </div>
        </div>
      )
    },
    {
      key: 'details',
      label: 'Details',
      render: (post: BlogPost) => (
        <div className="text-sm space-y-1">
          <div>📖 {post.reading_time} min read</div>
          <div>🏷️ {post.tags?.length || 0} tags</div>
          {post.spiritual_quotes && post.spiritual_quotes.length > 0 && (
            <div>💭 {post.spiritual_quotes.length} quotes</div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (post: BlogPost) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`/blog/post/${post.slug}`, '_blank')}
            title="View Post"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(post)}
            title="Edit Post"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(post.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete Post"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  if (loading) {
    return <LoadingScreen message="Loading blog posts..." />
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage spiritual wisdom articles</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="hidden md:flex">
          <Plus className="w-4 h-4 mr-2" />
          Create Blog Post
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <Badge variant="outline">
          Total: {posts.length}
        </Badge>
        <Badge variant="default">
          Published: {posts.filter(p => p.status === 'published').length}
        </Badge>
        <Badge variant="secondary">
          Drafts: {posts.filter(p => p.status === 'draft').length}
        </Badge>
        <Badge variant="outline">
          Featured: {posts.filter(p => p.featured).length}
        </Badge>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No blog posts yet"
          description="Start creating spiritual wisdom articles"
          action={
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Post
            </Button>
          }
        />
      ) : (
        <ResponsiveTable
          data={posts}
          columns={columns}
          keyExtractor={(post) => post.id}
        />
      )}

      <FloatingActionButton onClick={() => setIsFormOpen(true)} />

      <BlogForm
        post={selectedPost}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />
    </div>
  )
}
