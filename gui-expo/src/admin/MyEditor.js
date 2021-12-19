
import { Component } from 'react';
import { Editor, RichUtils } from 'draft-js';






class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.onChange = editorState => this.props.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }


  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'BOLD'));
  }

  _onItalicClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'ITALIC'));
  }

  _onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'UNDERLINE'));
  }

  _onH2Click() {
    this.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'HEADER'));
  }

  _onListClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'LIST'));
  }

  


  render() {

    const styleMap = {
      'HEADER': {
        fontSize: 22,
        padding: "5px 0",
        fontWeight: "bold"
      },
      'LIST': {
        paddingLeft: 25
      }
    };

    

    return (
        <div style={{ background: 'white', width: '100%', height: 250 }}>
            <button type='button' onClick={this._onBoldClick.bind(this)}><strong>b</strong></button>
            <button type='button' onClick={this._onItalicClick.bind(this)}><i>i</i></button>
            <button type='button' onClick={this._onUnderlineClick.bind(this)}><u>u</u></button>
            <button type='button' onClick={this._onListClick.bind(this)}>li</button>
            <button type='button' onClick={this._onH2Click.bind(this)}>H</button>
            
            <div style={{ padding: 10, overflow: 'auto', width: '100%', height: 225 }}>
                <Editor
                    customStyleMap={styleMap}
                    editorState={this.props.editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                />
            </div>
        </div>
    );
  }
}

export default MyEditor