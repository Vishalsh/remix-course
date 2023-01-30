import { Link, useLoaderData } from '@remix-run/react';
import type { LinksFunction, LoaderArgs, MetaDescriptor } from '@remix-run/node';
import { json } from '@remix-run/node';

import styles from '~/styles/note-details.css';
import { getStoredNotes } from '~/data/notes';

export default function NoteDetailsPage() {
  const note = useLoaderData<typeof loader>();

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}

export const links: LinksFunction = () => {
  return [{
    rel: "stylesheet", href: styles
  }]
}

export async function loader({ params }: LoaderArgs) {
  const notes = await getStoredNotes();
  const note = notes.find(n => n.id === params.noteId);

  if(!note) {
    throw json({ message: `could not find note with Id ${params.noteId}` }, {
      status: 404,
      statusText: 'Not Found',
    })
  }
  return note;
}

export function meta({ data }: any) {
  return {
    title: data.title,
    description: 'Manage your notes',
  }
}