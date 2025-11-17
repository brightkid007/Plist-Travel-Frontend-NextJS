"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AgentDashboardLayout from "../../common/layout";
import FormInput from "@/components/common/form/FormInput";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createAdminContent } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import "./custom.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const index = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],
      ["clean"],
    ],
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    if (!slug.trim()) return;
    if (!content || !content.trim()) return;
    setSaving(true);
    try {
      const payload = {
        type: "static",
        title: title.trim(),
        slug: slug.trim(),
        content: content,
        body: content,
        status: status === "published" ? "Published" : "Draft",
        meta_title: metaTitle || undefined,
        meta_keywords: metaKeywords || undefined,
        meta_description: metaDescription || undefined,
      };
      await createAdminContent(payload);
      toast.success("Page created");
      router.push("/admin/cms");
    } catch (error) {
      toast.error(error?.message || "Failed to create page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto cursor-pointer" onClick={() => router.back()}>
          <ArrowLeft />
        </div>
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Create New Page</h1>
        </div>
      </div>
      <div className="bg-white rounded-8 border-light px-20 py-15">
        <div className="row y-gap-10 x-gap-10 items-center mb-10">
          <div className="col-12">
            <div className="text-20 lh-14 fw-500">Page Details</div>
            <div className="text-14 lh-14 text-light-1">
              Add content for your new static page
            </div>
          </div>

          <FormInput
            label="Title"
            placeholder="Enter Page Title"
            gridClass="col-sm-6 mt-10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <FormInput
            label="Slug"
            placeholder="page-url-slug"
            gridClass="col-sm-6 mt-10"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <div className="col-12 mt-10">
            <h1 className="text-14 lh-12 fw-500 mb-10">Content</h1>
            <ReactQuill theme="snow" modules={modules} value={content} onChange={setContent} />
          </div>

          <FormInput
            label="Status"
            type="select"
            options={[
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
            ]}
            placeholder="Select Page Status"
            gridClass="col-12 mt-10"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          <FormInput
            label="Meta Title"
            placeholder="Enter Meta Title for SEO"
            gridClass="col-sm-6 mt-10"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
          />

          <FormInput
            label="Meta Keywords"
            placeholder="Enter Meta Keywords (comma separated)"
            gridClass="col-sm-6 mt-10"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
          />

          <FormInput
            label="Meta Description"
            placeholder="Enter Meta Description for SEO"
            gridClass="col-12 mt-10"
            type="textarea"
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />

          <div className="col-12 d-flex justify-end gap-2">
            <button className="border-light rounded-8 py-5 px-15 text-14" onClick={() => router.push("/admin/cms")}
            >
              Cancel
            </button>
            <button className="bg-blue-1 text-white rounded-8 py-5 px-15 text-14" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </AgentDashboardLayout>
  );
};

export default index;
