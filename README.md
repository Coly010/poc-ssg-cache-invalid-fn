## Proof of Concept Repo

This repo contains code that aims to stand as a proof of concept for the following thought:

> Can we have an intelligent SSG (Static-Site Generation) Solution that does not require redeploys when content changes?  
> Can we run a function when a user visits our site to determine if we need to rebuild the static files?

## Aims

- Implement a basic and naive CSR (client-side renderer) compiler
- Implement a basic and naive SSG compiler
- Create a server that will serve the static files
- Create a function that will check if the static files need to be rebuilt
  - if they do, send the visiting user the CSR files so they do not have to wait for a rebuild

## Thoughts

Right now this is using [EJS](https://ejs.co) as a renderer. This is because this is only intended to be a proof of concept.

Despite this, I feel like this concept could be applied to a View Library such as React.

The goal here will be to create a slim library that will:

- allow the developer to specify a function to determine if the Static files need to be rebuilt
- provide the command that needs to be run to rebuild the static files (allowing full flexibility in the underlying FE Framework / Library)
- provide an option to give users a CSR-based version of the site (to prevent people waiting on a rebuild)

I know [NextJS](https://nextjs.org/) has made a start on this kind of idea with their ISSG (Incremental Static Site Generation), however, I'd like to that to the next step, or at least prove it is possible.

## Contributing

Feel free to contribute and provide additional thoughts on this!!
