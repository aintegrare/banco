import type React from "react"
export default function BlogAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="blog-admin-layout">{children}</div>
}
