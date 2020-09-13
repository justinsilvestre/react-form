# React form component

Hi! Thanks for having a look at my form component built in React.

For ease of development with React and TypeScript I've put it in a Next.js app. You can run it like so:

```bash
$ yarn install
$ yarn dev
```

Your browser should then take you to http://localhost:3000.

## About my solution

I've tried to strike a balance between **ease of use** and **extensibility** by splitting my solution into two parts: `TextForm` and `Form`.

I started with the `TextForm` component. I wanted this component to have a super simple API, so that
someone could create a form just by providing a list of field names, labels, and optional validation specs.
You can see it used right in [`/pages/index.tsx`](/pages/index.tsx). (I also added an `onSubmit` prop for flair.)

While the `TextForm` API is easy to use, that ease of use comes at the cost of flexibility.
This API wouldn't serve us well in the event of a change in requirements, like if we suddenly needed to change how a certain text
field was displayed, or if we had to deal with input types besides just plain text.
With this in mind, I made sure that the internals of `TextForm` were made up of modular, composable
parts. I took care to clearly separate the visual elements from the field-updating logic, and
I made sure neither was too coupled to simple plain text input.

The result of this was a more generic `Form` component. You can see how it's used inside
[`/components/Form.tsx`](/components/Form.tsx). Instead of a list of field names, labels, and validation specs,
`Form` requires the consumer to provide an object with the initial fields state and a callback for validation.
These values are first passed to a `useForm` hook, which offers the benefit of exposing any part of the form state
which you might want to display or react to.

The `Form` API is a bit heavier than the `TextForm` API, but it's extremely flexible.
It hides away all the complex details of updating and validating field values, while still
letting you specify *exactly* how your markup should look. In addition, since it lets you initialize
the form with default field values, you can use it for both entering new data as well as editing
existing data. You could even use it with server-side rendering to make sure a form is filled in
as soon as the page is loaded.

The ideals of ease of use and extensibility are inevitably at odds with each other.
Here, I've tried to provide the best of both words by combining
this lightweight `TextForm` with the more heavy-duty `Form`. The `TextForm` helps you
get the job done fast, and you don't need to know anything about the gritty
details of form state in order to do it. And in the event the requirements change,
you won't have to entirely rewrite `TextForm`--instead, you can look inside
`TextForm.tsx` to see how it uses the generic `Form`. From there, you can
expose whatever parts of `Form` that you need to, and then `TextForm` 
can easily allow finer-grained control over field state, validation, or markup.
Or you could even use `TextForm.tsx` as a model for a
totally new kind of form component built on the foundation of `Form`.
