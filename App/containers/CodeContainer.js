import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Form, Segment, Button, Icon } from 'semantic-ui-react';

import classNames from 'classnames';
import Dropzone from 'react-dropzone';

import EditorContainer from '../containers/EditorContainer';

const TAB_CODE = 0;
const TAB_UPLOAD = 1;
const TAB_RESULTS = 2;


class CodeContainer extends Component {

  static propTypes = {
    code: React.PropTypes.string,
    obfuscatedCode: React.PropTypes.string,
    pending: React.PropTypes.bool,
    hasResults: React.PropTypes.bool,
    onCodeChange: React.PropTypes.func,
    onObfuscateClick: React.PropTypes.func,
    onDownloadCodeClick: React.PropTypes.func,
    onDownloadSourceMapClick: React.PropTypes.func,
    hasSourceMap: React.PropTypes.bool,
    hasObfuscatedCode: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: TAB_CODE,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pending && nextProps.hasResults) {
      this.setState({
        selectedTabIndex: TAB_RESULTS,
      })
    }
  }

  onTabClick(index) {
    this.setState({
      selectedTabIndex: index,
    });
  }

  onDrop(files) {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      this.props.onCodeChange(event.target.result);
    }

    reader.readAsText(file);

  }

  render() {
    const tabIndex = this.state.selectedTabIndex;

    const {
      code,
      obfuscatedCode,
      pending,
      onCodeChange,
      onObfuscateClick,
      onDownloadCodeClick,
      onDownloadSourceMapClick,
      hasSourceMap,
      hasObfuscatedCode,
    } = this.props;

    return (
      <div>

        <div className="ui top attached tabular menu">
          <Title active={tabIndex === TAB_CODE} onClick={() => this.onTabClick(TAB_CODE)}>复制/粘贴 JavaScript 代码</Title>
          <Title active={tabIndex === TAB_UPLOAD} onClick={() => this.onTabClick(TAB_UPLOAD)}>上传 JavaScript 文件</Title>
          <Title active={tabIndex === TAB_RESULTS} onClick={() => this.onTabClick(TAB_RESULTS)}>输出/下载</Title>
        </div>

        <Pane active={tabIndex === TAB_CODE}>
          <EditorContainer onBlur={onCodeChange} value={code} />
          <Segment basic>
            <Button
              loading={pending}
              disabled={pending}
              primary
              onClick={onObfuscateClick}
              >
                代码加密
            </Button>
          </Segment>
        </Pane>

        <Pane active={tabIndex === TAB_UPLOAD}>
          <Dropzone onDrop={::this.onDrop} multiple={false} className="DropZone">
            <div>文件拖拽到此处，或单击选择文件进行上传。</div>
          </Dropzone>
        </Pane>

        <Pane active={tabIndex === TAB_RESULTS}>
          <Form>
            <Form.TextArea
              value={obfuscatedCode}
              onFocus={(event) => event.target.select()}
              ></Form.TextArea>
          </Form>
          <Segment basic>
            <Button
              disabled={!hasObfuscatedCode}
              onClick={onDownloadCodeClick}
              >
                <Icon name='download' /> 下载加密代码
            </Button>
            { hasSourceMap &&
            <Button
              onClick={onDownloadSourceMapClick}
              >
                <Icon name='download' /> 下载 source map 文件
            </Button>
            }
          </Segment>
        </Pane>

      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    code: state.code.code,
    obfuscatedCode: state.code.obfuscatedCode,
    obfuscating: state.obfuscating,
  }
}

export default connect(mapStateToProps)(CodeContainer);


const Pane = (props) => {
  const className = classNames('ui bottom attached tab segment'.split(' '), {'active': props.active})
  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

Pane.propTypes = {
  active: React.PropTypes.bool.isRequired,
  children: React.PropTypes.node.isRequired,
}


const Title = (props) => {
  const className = classNames('item', {'active': props.active})
  return (
    <a className={className} onClick={props.onClick}>
      {props.children}
    </a>
  )
}

Title.propTypes = {
  active: React.PropTypes.bool.isRequired,
  children: React.PropTypes.node.isRequired,
  onClick: React.PropTypes.func.isRequired,
}
