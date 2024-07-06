# React Markdown Previewer

Welcome to the React Markdown Previewer application! This project allows you to input Markdown text and instantly see the rendered HTML output. It utilizes React for building the UI, **marked** for Markdown parsing, and **Prism.js** for syntax highlighting within code blocks.

## Features

- **Real-time Preview:** See live updates of the rendered HTML as you type Markdown.
- **Syntax Highlighting:** Code blocks in Markdown are highlighted using Prism.js, making them more readable.
- **Link Handling:** Links in Markdown open in a new tab for enhanced usability.
- **Editor and Preview Maximization:** Toggle between maximizing the editor or preview panes for a better view.

## Overview

This application consists of two main components:

- **Editor Pane:** Allows you to input Markdown text. Supports syntax highlighting for code blocks using **Prism.js.**
- **Preview Pane:** Displays the Markdown text rendered as HTML in real-time.

## Tech Stack

- **React:** Used for building the user interface and managing state.
- **marked:** A Markdown parser and compiler that converts Markdown into HTML.
- **Prism.js:** A lightweight syntax highlighter for code blocks in various languages.
- **HTML/CSS:** Used for styling and structuring the application.

## Setup Instructions
### Prerequisites

Before starting, make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:

        git clone <repository_url>
        cd react-markdown-previewer

2. Install dependencies:

        npm install

### Running the Application

To run the application locally:

        npm start

This will start the development server. Open http://localhost:3000 to view it in the browser.

#### Libraries Integration

`marked` \
The `marked` library is used for parsing Markdown text into HTML. It needs to be imported and configured with a custom renderer for links to open in a new tab.

        // Example configuration in your React component
        import marked from 'marked';

        marked.setOptions({
            breaks: true,
            highlight: function(code) {
                return Prism.highlight(code, Prism.languages.javascript, 'javascript');
        }});

        // Custom renderer for links
        const renderer = new marked.Renderer();
        renderer.link = function(href, title, text) {
            return `<a target="_blank" href="${href}">${text}</a>`;
        };

`Prism.js` \
`Prism.js` is used for syntax highlighting within code blocks in the Markdown content. Make sure to include the Prism styles and script in your HTML or import it into your project if using a bundler like Webpack.

        // Import Prism styles in your CSS or SCSS file
        @import 'prismjs/themes/prism.css';

        // Import Prism script in your JavaScript file
        import Prism from 'prismjs';

## Usage

Once the application is running, you can type Markdown text in the editor panel. The preview panel will update in real-time to show the rendered HTML output.

## CodePen

        https://codepen.io/Gunrapu/pen/ExMdyjw
        
## Credits

- **Create React App** - For bootstrapping React applications quickly.
- **marked** - For the Markdown parsing and rendering.
- **Prism.js** - For syntax highlighting within code blocks.
- **FontAwesome** - For the icons used in the application.
- FreeCodeCamp Front End Libraries Certification Project

        This project is part of the FreeCodeCamp Front End Libraries Certification.