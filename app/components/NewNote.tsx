import type { LinksFunction } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import type { action } from '~/routes/notes';
import styles from './NewNote.css';

function NewNote() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const errors = useActionData<typeof action>();

  return (
    <Form method="post" id="note-form">
      <p>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
        {errors?.title ? (
          <em>{errors.title}</em>
        ) : null}
      </p>
      <p>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows={5} />
        {errors?.content ? (
          <em>{errors.content}</em>
        ) : null}
      </p>
      <div className="form-actions">
        <button disabled={isSubmitting}>Add Note</button>
      </div>
    </Form>
  );
}

export default NewNote;

export const links: LinksFunction = () => {
  return [{
    rel: "stylesheet", href: styles
  }]
}