import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import LeelaayanBookForm from '@/components/LeelaayanBookForm'
import LeelaayanChapterForm from '@/components/LeelaayanChapterForm'
import { Edit, Trash2, Eye, Plus, BookMarked, Search, Book, List, EyeOff } from 'lucide-react'
import FloatingActionButton from '@/components/ui/floating-action-button'
import {
  ResponsiveTable,
  ResponsiveTableHeader,
  ResponsiveTableBody,
  ResponsiveTableRow,
  ResponsiveTableCell,
  MobileCardActions
} from '@/components/ui/responsive-table'
import LoadingScreen from '@/components/ui/loading-screen'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Book {
  id: string
  title: string
  title_hi: string
  slug: string
  description: string
  description_hi: string
  cover_image?: string
  author: string
  author_hi: string
  total_chapters: number
  views: number
  published: boolean
  created_at: string
}

interface Chapter {
  id: string
  book_id: string
  chapter_number: number
  title: string
  title_hi: string
  slug: string
  content: string
  content_hi: string
  chapter_image?: string
  read_time: number
  views: number
  published: boolean
  created_at: string
}

export default function LeelaayanBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isBookFormOpen, setIsBookFormOpen] = useState(false)
  const [isChapterFormOpen, setIsChapterFormOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [viewingBookId, setViewingBookId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('leelaayen_books')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (error: any) {
      console.error('Error loading books:', error)
      toast({
        title: 'Error',
        description: 'Failed to load books',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadChapters = async (bookId: string) => {
    try {
      const { data, error } = await supabase
        .from('leelaayen_chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('chapter_number', { ascending: true })

      if (error) throw error
      setChapters(data || [])
      setViewingBookId(bookId)
    } catch (error: any) {
      console.error('Error loading chapters:', error)
      toast({
        title: 'Error',
        description: 'Failed to load chapters',
        variant: 'destructive'
      })
    }
  }

  const handleEditBook = (book: Book) => {
    setSelectedBook(book)
    setIsBookFormOpen(true)
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book? All chapters will also be deleted.')) return

    try {
      const { error } = await supabase
        .from('leelaayen_books')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Book deleted successfully'
      })
      loadBooks()
      if (viewingBookId === id) {
        setViewingBookId(null)
        setChapters([])
      }
    } catch (error: any) {
      console.error('Error deleting book:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete book',
        variant: 'destructive'
      })
    }
  }

  const handleToggleBookPublish = async (book: Book) => {
    try {
      const { error } = await supabase
        .from('leelaayen_books')
        .update({ published: !book.published })
        .eq('id', book.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: `Book ${!book.published ? 'published' : 'unpublished'} successfully`
      })
      loadBooks()
    } catch (error: any) {
      console.error('Error updating book:', error)
      toast({
        title: 'Error',
        description: 'Failed to update book',
        variant: 'destructive'
      })
    }
  }

  const handleEditChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter)
    setIsChapterFormOpen(true)
  }

  const handleDeleteChapter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return

    try {
      const { error } = await supabase
        .from('leelaayen_chapters')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Chapter deleted successfully'
      })
      if (viewingBookId) loadChapters(viewingBookId)
    } catch (error: any) {
      console.error('Error deleting chapter:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete chapter',
        variant: 'destructive'
      })
    }
  }

  const handleToggleChapterPublish = async (chapter: Chapter) => {
    try {
      const { error } = await supabase
        .from('leelaayen_chapters')
        .update({ published: !chapter.published })
        .eq('id', chapter.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: `Chapter ${!chapter.published ? 'published' : 'unpublished'} successfully`
      })
      if (viewingBookId) loadChapters(viewingBookId)
    } catch (error: any) {
      console.error('Error updating chapter:', error)
      toast({
        title: 'Error',
        description: 'Failed to update chapter',
        variant: 'destructive'
      })
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.title_hi.includes(searchQuery) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <LoadingScreen message="Loading divine books..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookMarked className="w-8 h-8 text-orange-500" />
            Leelaayen - Divine Books
          </h1>
          <p className="text-gray-600 mt-1">Manage sacred stories like Mahabharat, Ramayan</p>
        </div>
        <Button
          onClick={() => {
            setSelectedBook(null)
            setIsBookFormOpen(true)
          }}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Book
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-sm text-gray-600">Total Books</p>
          <p className="text-2xl font-bold text-gray-900">{books.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Published</p>
          <p className="text-2xl font-bold text-gray-900">{books.filter(b => b.published).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Chapters</p>
          <p className="text-2xl font-bold text-gray-900">{books.reduce((sum, b) => sum + b.total_chapters, 0)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-2xl font-bold text-gray-900">{books.reduce((sum, b) => sum + b.views, 0)}</p>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow">
        <ResponsiveTable>
          <ResponsiveTableHeader>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Chapters</th>
              <th>Views</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ResponsiveTableHeader>
          <ResponsiveTableBody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No books found. Click "Add New Book" to create one.
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <ResponsiveTableRow key={book.id}>
                  <ResponsiveTableCell label="Book">
                    <div className="flex items-center gap-3">
                      {book.cover_image ? (
                        <img src={book.cover_image} alt={book.title} className="w-12 h-16 object-cover rounded shadow" />
                      ) : (
                        <div className="w-12 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded shadow flex items-center justify-center">
                          <Book className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{book.title}</p>
                        <p className="text-sm text-gray-500">{book.title_hi}</p>
                      </div>
                    </div>
                  </ResponsiveTableCell>
                  <ResponsiveTableCell label="Author">
                    <div>
                      <p className="text-gray-900">{book.author}</p>
                      <p className="text-sm text-gray-500">{book.author_hi}</p>
                    </div>
                  </ResponsiveTableCell>
                  <ResponsiveTableCell label="Chapters">
                    <Badge variant="outline">{book.total_chapters}</Badge>
                  </ResponsiveTableCell>
                  <ResponsiveTableCell label="Views">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span>{book.views}</span>
                    </div>
                  </ResponsiveTableCell>
                  <ResponsiveTableCell label="Status">
                    <Badge variant={book.published ? 'default' : 'secondary'} className={book.published ? 'bg-green-500' : ''}>
                      {book.published ? 'Published' : 'Draft'}
                    </Badge>
                  </ResponsiveTableCell>
                  <ResponsiveTableCell label="Actions">
                    <MobileCardActions>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadChapters(book.id)}
                        title="View Chapters"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleBookPublish(book)}
                        title={book.published ? 'Unpublish' : 'Publish'}
                      >
                        {book.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBook(book)}
                        title="Edit Book"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBook(book.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </MobileCardActions>
                  </ResponsiveTableCell>
                </ResponsiveTableRow>
              ))
            )}
          </ResponsiveTableBody>
        </ResponsiveTable>
      </div>

      {/* Chapters Dialog */}
      <Dialog open={viewingBookId !== null} onOpenChange={(open) => !open && setViewingBookId(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                Chapters - {books.find(b => b.id === viewingBookId)?.title}
              </span>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedChapter(null)
                  setIsChapterFormOpen(true)
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Chapter
              </Button>
            </DialogTitle>
            <DialogDescription>
              Manage chapters for this book
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {chapters.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Book className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No chapters found. Click "Add Chapter" to create one.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-orange-500">Ch. {chapter.chapter_number}</Badge>
                          <h4 className="font-semibold text-gray-900">{chapter.title}</h4>
                          <Badge variant={chapter.published ? 'default' : 'secondary'} className={chapter.published ? 'bg-green-500' : ''}>
                            {chapter.published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{chapter.title_hi}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{chapter.read_time} min read</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {chapter.views}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleChapterPublish(chapter)}
                        >
                          {chapter.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditChapter(chapter)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Book Form Dialog */}
      <Dialog open={isBookFormOpen} onOpenChange={setIsBookFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            <DialogDescription>
              {selectedBook ? 'Update book information' : 'Add a new divine book to the library'}
            </DialogDescription>
          </DialogHeader>
          <LeelaayanBookForm
            book={selectedBook}
            onSuccess={() => {
              setIsBookFormOpen(false)
              setSelectedBook(null)
              loadBooks()
            }}
            onCancel={() => {
              setIsBookFormOpen(false)
              setSelectedBook(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Chapter Form Dialog */}
      <Dialog open={isChapterFormOpen} onOpenChange={setIsChapterFormOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedChapter ? 'Edit Chapter' : 'Add New Chapter'}</DialogTitle>
            <DialogDescription>
              {selectedChapter ? 'Update chapter content' : 'Add a new chapter to the book'}
            </DialogDescription>
          </DialogHeader>
          <LeelaayanChapterForm
            chapter={selectedChapter}
            bookId={viewingBookId!}
            onSuccess={() => {
              setIsChapterFormOpen(false)
              setSelectedChapter(null)
              if (viewingBookId) loadChapters(viewingBookId)
            }}
            onCancel={() => {
              setIsChapterFormOpen(false)
              setSelectedChapter(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <FloatingActionButton onClick={() => {
        setSelectedBook(null)
        setIsBookFormOpen(true)
      }} />
    </div>
  )
}
