// Immediately invoked function expression (IIFE) to encapsulate the code
!function() {
    "use strict";
  
    // Configure Marked.js options and Prism.js for syntax highlighting
    marked.setOptions({
        breaks: true,
        highlight: function(code) {
            return Prism.highlight(code, Prism.languages.javascript, "javascript");
        }
    });
  
    // Custom renderer for links to open in new tab
    const renderer = new marked.Renderer();
    renderer.link = function(href, title, text) {
        return `<a target="_blank" href="${href}">${text}</a>`;
    };
    
    // React Component for the Markdown Previewer
    class MarkdownPreviewer extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                markdown: initialMarkdown,
                editorMaximized: false,
                previewMaximized: false
            };
            this.handleChange = this.handleChange.bind(this);
            this.handleEditorMaximize = this.handleEditorMaximize.bind(this);
            this.handlePreviewMaximize = this.handlePreviewMaximize.bind(this);
        }
  
        // Handle textarea input change
        handleChange(event) {
            this.setState({
                markdown: event.target.value
            });
        }
  
        // Maximize/minimize editor pane
        handleEditorMaximize() {
            this.setState({
                editorMaximized: !this.state.editorMaximized
            });
        }
  
        // Maximize/minimize preview pane
        handlePreviewMaximize() {
            this.setState({
                previewMaximized: !this.state.previewMaximized
            });
        }
  
        render() {
            // Determine classes and icons based on maximized state
            const classNames = this.state.editorMaximized
                ? ["editorContainer maximized", "previewContainer hide", "fa fa-compress"]
                : this.state.previewMaximized
                    ? ["editorContainer hide", "previewContainer maximized", "fa fa-compress"]
                    : ["editorContainer", "previewContainer", "fa fa-arrows-alt"];
  
            return (
                <div>
                    {/* Editor pane */}
                    <div className={classNames[0]}>
                        <Toolbar onClick={this.handleEditorMaximize} text="Editor" icon={classNames[2]} />
                        <Editor markdown={this.state.markdown} onChange={this.handleChange} />
                    </div>
  
                    {/* Divider */}
                    <div className="converter"></div>
  
                    {/* Preview pane */}
                    <div className={classNames[1]}>
                        <Toolbar onClick={this.handlePreviewMaximize} text="Previewer" icon={classNames[2]} />
                        <Preview markdown={this.state.markdown} />
                    </div>
                </div>
            );
        }
    }
  
    // Toolbar component with title and maximize icon
    const Toolbar = ({ onClick, text, icon }) => (
        <div className="nameBar">
            <i className="fa fa-sun-o" title="editor-zone"></i>
            {text}
            <i className={icon} onClick={onClick}></i>
        </div>
    );
  
    // Editor component with textarea for input
    const Editor = ({ markdown, onChange }) => (
        <textarea id="editor" onChange={onChange} value={markdown} />
    );
  
    // Preview component showing converted Markdown
    const Preview = ({ markdown }) => (
        <div id="preview" dangerouslySetInnerHTML={{ __html: marked(markdown, { renderer }) }} />
    );
  
    const initialMarkdown = "# Welcome to my React Markdown Previewer!\n\n## This is a sub-heading...\n### And here's some other cool stuff:\n\nHeres some code, `<div></div>`, between 2 backticks.\n\n```\n// this is multi-line code:\n\nfunction anotherExample(firstLine, lastLine) {\n  if (firstLine == '```' && lastLine == '```') {\n    return multiLineCode;\n  }\n}\n```\n\nYou can also make text **bold**... whoa!\nOr _italic_.\nOr... wait for it... **_both!_**\nAnd feel free to go crazy ~~crossing stuff out~~.\n\nThere's also [links](https://www.freecodecamp.org), and\n> Block Quotes!\n\nAnd if you want to get really crazy, even tables:\n\nWild Header | Crazy Header | Another Header?\n------------ | ------------- | -------------\nYour content can | be here, and it | can be here....\nAnd here. | Okay. | I think we get it.\n\n- And of course there are lists.\n  - Some are bulleted.\n     - With different indentation levels.\n        - That look like this.\n\n\n1. And there are numbered lists too.\n1. Use just 1s if you want!\n1. And last but not least";
  ReactDOM.render(React.createElement(T, null), document.getElementById("app"));
}();