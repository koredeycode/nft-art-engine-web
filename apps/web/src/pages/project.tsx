import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { api, type Project } from "@/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
  const project = await api.get<Project>(`/projects/${params.id as string}`);
  return { project };
}

export function ProjectPage() {
  const { project } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <a href="/" className="text-blue-600 hover:underline text-sm">
        &larr; Back
      </a>
      <h1 className="text-3xl font-bold mt-4 mb-6">{project.name}</h1>
      <div className="border rounded-lg p-4 space-y-2">
        <p><span className="font-semibold">ID:</span> {project.id}</p>
        <p><span className="font-semibold">Network:</span> {project.network}</p>
      </div>
    </div>
  );
}
