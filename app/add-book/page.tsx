"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CircleArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  yearPublished: number;
  imageUrl: string;
  description: string;
}

export default function AddBookPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [yearPublished, setYearPublished] = useState(0);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // fetchBooks
  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/books");
      const data = await res.json();

      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        console.warn("Expected an array but got:", data);
        setBooks([]); // fallback
      }
    } catch (err) {
      console.error(err);
      setBooks([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // preview image when user chooses file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const createBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("yearPublished", yearPublished.toString());
    formData.append("description", description);
    formData.append("image", file);

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:8080/api/books/create", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create book");
      const data = await res.json();
      setBooks((prev) => [...prev, data]);

      // Reset form
      setTitle("");
      setAuthor("");
      setYearPublished(0);
      setDescription("");
      setFile(null);
      setPreviewUrl(null);
      router.push("/");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm shadow-lg shadow-black/40">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          Loading library data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-white/10 from-slate-900/60 via-slate-900/40 to-transparent">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur">
              <Link href="/" className="inline-flex items-center gap-2">
                <CircleArrowLeft />
                Back
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/40">
                <BookOpen className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  New Book Entry
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  Fill out the details, upload a cover, and see a live preview
                  before you add it to your library.
                </p>
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p>Total books: {books.length}</p>
            {books.length > 0 && (
              <p className="mt-0.5">
                Latest year:{" "}
                {Math.max(...books.map((b) => Number(b.yearPublished) || 0))}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 pb-14 pt-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {/* Form card */}
          <Card className="border-slate-800 bg-slate-900/80 shadow-xl shadow-black/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-slate-50">
                Book details
              </CardTitle>
              <p className="mt-1 text-xs text-slate-400">
                Required fields are marked with{" "}
                <span className="text-emerald-400">*</span>
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={createBook} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs text-slate-200">
                    Title <span className="text-emerald-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. The Pragmatic Programmer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="author" className="text-xs text-slate-200">
                    Author <span className="text-emerald-400">*</span>
                  </Label>
                  <Input
                    id="author"
                    placeholder="e.g. Andrew Hunt & David Thomas"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="yearPublished"
                      className="text-xs text-slate-200"
                    >
                      Year published <span className="text-emerald-400">*</span>
                    </Label>
                    <Input
                      id="yearPublished"
                      type="text"
                      placeholder="2025"
                      value={yearPublished}
                      onChange={(e) => setYearPublished(parseInt(e.target.value))}
                      required
                      className="border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="description"
                    className="text-xs text-slate-200"
                  >
                    Description <span className="text-emerald-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Write a short description or summary of the book..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="min-h-[90px] border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                </div>

                {/* Custom file input */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-200">
                    Cover image <span className="text-emerald-400">*</span>
                  </Label>
                  <label className="group flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 transition hover:border-emerald-500/70 hover:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900/80">
                        <ImagePlus className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-100">
                          {file ? file.name : "Choose a cover image"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          JPG, PNG • Recommended: portrait cover
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full border border-slate-700/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                      Browse
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 w-full bg-emerald-500 text-sm font-medium text-slate-950 hover:bg-emerald-400"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving book...
                    </span>
                  ) : (
                    "Add book to library"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Live preview card */}
          <Card className="border-slate-800 bg-slate-900/80 shadow-xl shadow-black/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm text-slate-100">
                Live preview
              </CardTitle>
              <p className="mt-1 text-xs text-slate-400">
                This is how the book might look in your collection.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative h-52 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 from-slate-950/90 via-slate-950/10 to-transparent" />
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
                    <ImagePlus className="h-6 w-6" />
                    <p className="text-xs">Cover preview will appear here</p>
                  </div>
                )}
                <div className="absolute left-2 top-2">
                  <Badge className="bg-slate-950/80 text-[11px] font-normal text-slate-200 ring-1 ring-slate-700/80">
                    {yearPublished || "Year"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-50">
                  {title || "Book title"}
                </h3>
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-400/90">
                  {author || "Author name"}
                </p>
                <p className="mt-1 line-clamp-4 text-xs text-slate-300/90">
                  {description ||
                    "Book description will appear here as you type."}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>Preview only</span>
                </span>
                <span className="rounded-full border border-slate-700/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                  Draft
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
