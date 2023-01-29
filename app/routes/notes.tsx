import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, Note, storeNotes } from "~/data/notes";

export default function NotesPage() {
  const notes = useLoaderData<typeof loader>();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();

  return json(notes);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const title = formData.get('title');
  const content = formData.get('title');

  if (title && content) {
    const note: Note = {
      id: new Date().toISOString(),
      title,
      content,
    };

    const existingNotes = await getStoredNotes();
    note.id = new Date().toISOString();
    await storeNotes(existingNotes.concat(note));
    return redirect('/notes');
  }
}

export const links: LinksFunction = () => {
  return [...newNoteLinks(), ...noteListLinks()];
}