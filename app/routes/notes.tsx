import type { ActionArgs, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useCatch } from "@remix-run/react";
import invariant from "tiny-invariant";

import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/notes";
export default function NotesPage() {
  return (
    <main>
      <NewNote />
      <NoteList />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();

  if (notes.length === 0) {
    throw json({ message: 'could not find any notes' }, {
      status: 404,
      statusText: 'Not Found',
    })
  }
  return json(notes);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const title = formData.get('title');
  const content = formData.get('content');
  const errors = {
    title: title ? null : "Title is required",
    content: content ? null : "Content is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }
  invariant(typeof title === "string", "title must be a string");
  invariant(typeof content === "string", "content must be a string");
  const note = {
    id: new Date().toISOString(),
    title,
    content,
  }
  const existingNotes = await getStoredNotes();
  note.id = new Date().toISOString();
  await storeNotes(existingNotes.concat(note));
  return redirect('/notes');
}

export const links: LinksFunction = () => {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <main className="error">
      <h1>An Error Occured to ur notes</h1>
      <p>{error.message}</p>
      <p>Back to <Link to="/">Safety</Link>!</p>
    </main>
  )
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  const message = caughtResponse.data?.message || 'Data not found';

  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  )
}

export function meta() {
  return {
    title: 'All Notes',
    description: 'Manage your notes',
  }
}