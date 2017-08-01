// @flow
import React from 'react'
import compose from 'ramda/src/compose'

type Props = {
  children: React$Element<*>,
  css?: any,
  activeCss?: any,
}

type State = {
  isActive: boolean,
}

class FolderDropzone extends React.Component {
  props: Props
  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      isActive: false,
    }
  }

  onDragStart = (e) => {
    this.setActiveState(true)
  }

  onDragEnter = (e) => {
    this.setActiveState(true)
  }

  onDragOver = (e) => {
    e.preventDefault()
  }

  onDragLeave = (e) => {
    this.setActiveState(false)
  }

  onDrop = (e) => {
    e.preventDefault()
    this.setActiveState(false)
    const entry = e.dataTransfer.items[0].webkitGetAsEntry()
    if (entry.isDirectory) {
      const path = e.dataTransfer.files[0].path
    }
  }

  setActiveState(newState) {
    if(this.state.isActive !== newState){
      this.setState({isActive: newState})
    }
  }

  render() {
    return (
      <div
        className={this.state.isActive ? this.props.activeCss : this.props.css}
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}>
        {this.props.children}
      </div>
    )
  }
}

export default compose(
  (a) => a
)(FolderDropzone)
