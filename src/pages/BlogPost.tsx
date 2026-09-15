import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
}

const SITE = "https://advantflowai.com";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  // FIX: track fetch errors separately so we can show a distinct error message
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setError(false);
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data, error: fetchError }) => {
        // FIX: handle actual network/query errors vs simply not finding a post
        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 = "no rows returned" which just means post not found — not an error
          setError(true);
        } else {
          setPost(data);
        }
        setLoading(false);
      });
  }, [slug]);

  return (
    <main className="relative">
      <Navbar />
      <section className="section-padding pt-36 md:pt-44 min-h-screen">
        <div className="container-wide max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            // FIX: distinct error state for when the fetch itself fails
            <div className="text-center py-20">
              <h1 className="heading-md mb-4">Something went wrong</h1>
              <p className="text-muted-foreground mb-6">We couldn't load this article. Please try again.</p>
              <Link to="/blog" className="text-primary hover:underline font-medium">
                Back to all articles
              </Link>
            </div>
          ) : !post ? (
            <div className="text-center py-20">
              <h1 className="heading-md mb-4">Post not found</h1>
              <p className="text-muted-foreground mb-6">This article may have been removed or moved.</p>
              <Link to="/blog" className="text-primary hover:underline font-medium">
                Back to all articles
              </Link>
            </div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {post.cover_image_url && (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full rounded-2xl mb-8 aspect-video object-cover"
                />
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.created_at), "dd MMMM yyyy")}
              </div>
              <h1 className="heading-lg mb-8">{post.title}</h1>
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:font-display prose-headings:text-foreground
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-a:text-primary prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content, { USE_PROFILES: { html: true } }) }}
              />
            </motion.article>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default BlogPost;
