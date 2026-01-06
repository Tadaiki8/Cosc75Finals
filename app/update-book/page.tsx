// app/update-book/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CircleArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  yearPublished: number;
  description: string;
  imageUrl: string;
}

// 👉 Inner component that uses useSearchParams
function UpdateBookInner() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("id");
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [yearPublished, setYearPublished] = useState<number>(2025);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!bookId) return;

    fetch(`http://localhost:8080/api/books/${bookId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Book not found");
        return res.json();
      })
      .then((data: Book) => {
        setTitle(data.title);
        setAuthor(data.author);
        setYearPublished(data.yearPublished);
        setDescription(data.description);

        setCurrentImagePath(data.imageUrl || null);
        setPreviewUrl(
          data.imageUrl ? `http://localhost:8080${data.imageUrl}` : null
        );
      })
      .catch((err) => console.error(err));
  }, [bookId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleResetFile = () => {
    setFile(null);
    setPreviewUrl(
      currentImagePath ? `http://localhost:8080${currentImagePath}` : null
    );
  };

  const updateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId) return;

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("yearPublished", yearPublished.toString());
      formData.append("description", description);

      if (file) {
        formData.append("image", file);
      }

      const response = await fetch(
        `http://localhost:8080/api/books/update/${bookId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update book");

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Failed to update book. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔻 YOUR EXISTING JSX (I’ll keep it, just slightly trimmed for clarity)
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
                  Edit Book
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  Update details, change cover, or preview the book before
                  saving changes.
                </p>
              </div>
            </div>
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
              <form onSubmit={updateBook} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs text-slate-200">
                    Title <span className="text-emerald-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                  <Label htmlFor="author" className="text-xs text-slate-200">
                    Author <span className="text-emerald-400">*</span>
                  </Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                </div>

                {/* Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="yearPublished"
                      className="text-xs text-slate-200"
                    >
                      Year published{" "}
                      <span className="text-emerald-400">*</span>
                    </Label>
                    <Input
                      id="yearPublished"
                      type="number"
                      value={yearPublished}
                      onChange={(e) =>
                        setYearPublished(Number(e.target.value) || 0)
                      }
                      required
                      className="border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="description"
                    className="text-xs text-slate-200"
                  >
                    Description <span className="text-emerald-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="min-h-[90px] border-slate-700 bg-slate-900/70 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                  />
                </div>

                {/* File input */}
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
                          {file
                            ? file.name
                            : currentImagePath?.split("/").pop() ||
                              "Choose a cover image"}
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
                      Saving changes...
                    </span>
                  ) : (
                    "Save Changes"
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
                Preview your book updates in real-time.
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
                    <p className="text-xs">
                      Cover preview will appear here
                    </p>
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
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
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

// 👇 IMPORTANT: this must exist for Next.js
export default function UpdateBookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-100">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading book...
        </div>
      }
    >
      <UpdateBookInner />
    </Suspense>
  );
}
