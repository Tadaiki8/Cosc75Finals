"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Search,
  Loader2,
  Trash2,
  Edit3,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Book {
  id: number;
  title: string;
  author: string;
  yearPublished: number;
  imageUrl: string;
  description: string;
}

export default function BooksLandingPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // for preview dialog

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const q = search.toLowerCase();
    return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      String(book.yearPublished).includes(q)
    );
  });

  const handleDelete = async (bookId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/books/${bookId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete book");

      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      toast.success("Delete has been success");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete book, Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        {/* Top gradient / hero */}
        <header className="border-b border-white/10 from-slate-900/60 via-slate-900/40 to-transparent">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Your personal book shelf
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/40">
                  <BookOpen className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Library Collection
                  </h1>
                  <p className="mt-1 max-w-xl text-sm text-slate-300 md:text-[15px]">
                    Browse all the books you&apos;ve added. Search by title,
                    author, or year and manage your collection.
                  </p>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex w-full max-w-sm flex-col gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search title, author, year..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-slate-700 bg-slate-900/70 pl-9 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="mt-1 text-[11px] text-slate-400">
                  Showing {filteredBooks.length} of {books.length} book
                  {books.length !== 1 && "s"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
          {loading ? (
            <div className="flex h-60 items-center justify-center">
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 shadow-lg shadow-black/20 backdrop-blur">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                Loading your library...
              </div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="flex h-60 flex-col items-center justify-center text-center text-slate-300">
              <BookOpen className="mb-3 h-7 w-7 text-slate-500" />
              <p className="text-sm font-medium">No books found</p>
              <p className="mt-1 max-w-xs text-xs text-slate-400">
                Try adjusting your search or add new books.
              </p>
              <Link href="/add-book" className="mt-4">
                <Button size="sm" className="flex items-center gap-1 text-xs">
                  <Plus className="h-4 w-4" />
                  Add your first book
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  className="group relative flex h-full flex-col overflow-hidden border-slate-800/80 bg-slate-900/70 shadow-lg shadow-black/30 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-emerald-900/60"
                >
                  {/* Clickable area for preview */}
                  <button
                    type="button"
                    onClick={() => setSelectedBook(book)}
                    className="flex flex-1 flex-col text-left"
                  >
                    {/* Cover */}
                    <div className="relative h-52 w-full overflow-hidden">
                      <img
                        src={`http://localhost:8080${book.imageUrl}`}
                        alt={book.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 from-slate-950/90 via-slate-950/10 to-transparent opacity-70 group-hover:opacity-60" />
                      <div className="absolute left-2 top-2">
                        <Badge className="bg-slate-950/80 text-[11px] font-normal text-slate-200 ring-1 ring-slate-700/80">
                          {book.yearPublished}
                        </Badge>
                      </div>
                    </div>

                    {/* Info */}
                    <CardContent className="flex flex-1 flex-col gap-2 p-4">
                      <div>
                        <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-50">
                          {book.title}
                        </h3>
                        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-emerald-400/90">
                          {book.author}
                        </p>
                      </div>

                      <p className="mt-1 line-clamp-3 text-xs text-slate-300/90">
                        {book.description}
                      </p>

                      <div className="mt-3 flex justify-between">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <BookOpen className="h-3 w-3" />
                          Book #{book.id}
                        </div>
                        <span className="rounded-full border border-slate-700/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                          Preview
                        </span>
                      </div>
                    </CardContent>
                  </button>

                  {/* Actions (not clickable area for preview) */}
                  <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-2.5">
                    <div className="flex gap-2">
                      <Link href={`/update-book?id=${book.id}`}>
                        <Button
                          size="sm"
                          className="flex items-center gap-1 rounded-full border border-emerald-500/50 bg-slate-800/60 px-3 py-1 text-xs text-emerald-400 shadow-sm backdrop-blur transition-all hover:bg-emerald-500/20 hover:text-emerald-50 hover:shadow-md hover:shadow-emerald-500/50"
                        >
                          <Edit3 className="h-4 w-4" /> Edit
                        </Button>
                      </Link>

                      <Button
                        onClick={() => handleDelete(book.id)}
                        size="sm"
                        className="flex items-center gap-1 rounded-full border border-red-500/50 bg-slate-800/60 px-3 py-1 text-xs text-red-400 shadow-sm backdrop-blur transition-all hover:bg-red-500/20 hover:text-red-50 hover:shadow-md hover:shadow-red-500/50"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Preview Dialog – READ ONLY, no editing */}
      {/* Preview Dialog – READ ONLY, no editing */}
      <Dialog
        open={selectedBook !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedBook(null);
        }}
      >
        <DialogContent
          className="
            max-w-2xl 
            border-slate-700 
            bg-slate-950/95 
            text-slate-50 
            backdrop-blur 
            max-h-[calc(100vh-4rem)]    /* may space top/bottom */
            flex flex-col
          "
        >
          <DialogHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-lg font-semibold">
                {selectedBook?.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Preview only — this view is read-only. Use the Edit button on
                the card if you want to update this book.
              </DialogDescription>
            </div>
          </DialogHeader>

          {selectedBook && (
            <div className="mt-3 grid gap-4 md:grid-cols-[1fr,1.3fr] overflow-y-auto pr-1 pb-2">
              {/* Cover */}
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
                <img
                  src={`http://localhost:8080${selectedBook.imageUrl}`}
                  alt={selectedBook.title}
                  className="h-64 w-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Author
                  </p>
                  <p className="text-sm text-slate-100">
                    {selectedBook.author}
                  </p>
                </div>

                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Year Published
                    </p>
                    <p className="text-sm text-slate-100">
                      {selectedBook.yearPublished}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      ID
                    </p>
                    <p className="text-sm text-slate-100">#{selectedBook.id}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Description
                  </p>
                  <p className="mt-1 max-h-40 overflow-y-auto text-[13px] leading-relaxed text-slate-200">
                    {selectedBook.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
