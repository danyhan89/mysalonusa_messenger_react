import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import Input from "@app/Input";
import Button from "@app/Button";
import Label from "@app/Label";



class ChatroomContent extends Component {
  constructor(props) {
    super(props);

    // this.inputRef = cmp => {
    //   this.inputNode = cmp ? findDOMNode(cmp) : null;
    // };

    this.clearText = this.clearText.bind(this);
    this.onTextChange = this.onTextChange.bind(this);

    this.state = {
      text: ""
    }
  }

  onTextChange(text) {
    this.setState({
      text
    });
  }

  clearText() {
    this.setState({
      text: ""
    });
  }

  render() {
    const { onSubmit, stylesForm, stylesInput, inputRef } = this.props;
    return(
      <form onSubmit={(ev) => {onSubmit(ev, this.state.text, this.clearText);}} className={`${stylesForm} pb2 ph2`}>
        <Input
          autoFocus={false}
          ref={inputRef}
          placeholder="Your message"
          onChange={this.onTextChange}
          value={this.state.text}
          className={`${stylesInput} mt2 mr2`}
        />
        <Button disabled={!this.state.text} className={`br2 ph2 mt2`}>
          <Label>Send</Label>
        </Button>
      </form>
    );
  }
}


export default ChatroomContent;


