import React, {PropTypes} from 'react'
import {getSelection, setSelection} from 'react/lib/ReactInputSelection'
import {
  conformToMask,
  convertMaskToPlaceholder,
  adjustCaretPosition
} from '../../../core/src/index.js'

export default React.createClass({
  propTypes: {
    mask: PropTypes.string.isRequired
  },

  getInitialState() {
    const value = convertMaskToPlaceholder(this.props.mask)

    return {
      placeholder: value,
      previousValue: value,
      conformToMaskResults: {},
      currentCaretPosition: null
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      placeholder: convertMaskToPlaceholder(nextProps.mask),
      value: null
    })
  },

  componentDidUpdate() {
    // Check that inputElement has focus
    if (this.refs.inputElement === document.activeElement) {
      // If setSelection is called while inputElement doesn't have focus, it's gonna steal focus,
      // which is not what we want here.
      const caretPosition = adjustCaretPosition({
        previousInput: this.state.previousValue,
        conformToMaskResults: this.state.conformToMaskResults,
        currentCaretPosition: this.state.currentCaretPosition
      })

      setSelection(this.refs.inputElement, {start: caretPosition, end: caretPosition})
    }
  },

  render() {
    const {props, state, onChange} = this
    const placeholder = props.placeholder || state.placeholder
    const value = (state.conformToMaskResults.output !== state.placeholder) ?
      state.conformToMaskResults.output :
      ''

    return (
      <input
        {...props}
        type="text"
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        ref="inputElement"
      />
    )
  },

  onChange(event) {
    const state = {
      conformToMaskResults: conformToMask(event.target.value, this.props.mask),
      previousValue: this.state.conformToMaskResults.output || this.state.previousValue,
      currentCaretPosition: getSelection(this.refs.inputElement).start
    }

    this.setState(state)

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event)
    }
  },
})