import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import * as actions from 'mirador/dist/es/src/state/actions';
import { getWindowViewType } from 'mirador/dist/es/src/state/selectors';
import CanvasListItem from '../CanvasListItem';
import AnnotationActionsContext from '../AnnotationActionsContext';
import SingleCanvasDialog from '../SingleCanvasDialog';
import {getCompanionWindowsForContent} from "mirador/dist/es/src/state/selectors/companionWindows";

/** */
class CanvasAnnotationsWrapper extends Component {
  /** */
  constructor(props) {
    super(props);
    this.state = {
      singleCanvasDialogOpen: false,
    };
    this.toggleSingleCanvasDialogOpen = this.toggleSingleCanvasDialogOpen.bind(this);
  }

  /** */
  toggleSingleCanvasDialogOpen() {
    const { singleCanvasDialogOpen } = this.state;
    this.setState({
      singleCanvasDialogOpen: !singleCanvasDialogOpen,
    });
  }



  /** */
  render() {
    const {
      addCompanionWindow, annotationsOnCanvases, canvases, config, receiveAnnotation,
      switchToSingleCanvasView, TargetComponent, targetProps, windowViewType, containerRef,annotationEdit
    } = this.props;
    const { singleCanvasDialogOpen } = this.state;
    const props = {
      ...targetProps,
      listContainerComponent: CanvasListItem,
    };
    return (
      <AnnotationActionsContext.Provider
        value={{
          addCompanionWindow,
          annotationsOnCanvases,
          canvases,
          config,
          receiveAnnotation,
          storageAdapter: config.annotation.adapter,
          toggleSingleCanvasDialogOpen: this.toggleSingleCanvasDialogOpen,
          windowId: targetProps.windowId,
          windowViewType,
          annotationEdit
        }}
      >
        <TargetComponent
          {...props}
          ref={containerRef}
        />
        {windowViewType !== 'single' && (
          <SingleCanvasDialog
            handleClose={this.toggleSingleCanvasDialogOpen}
            open={singleCanvasDialogOpen}
            switchToSingleCanvasView={switchToSingleCanvasView}
          />
        )}
      </AnnotationActionsContext.Provider>
    );
  }
}

CanvasAnnotationsWrapper.propTypes = {
  addCompanionWindow: PropTypes.func.isRequired,
  annotationsOnCanvases: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, index: PropTypes.number }),
  ),
  config: PropTypes.shape({
    annotation: PropTypes.shape({
      adapter: PropTypes.func,
    }),
  }).isRequired,
  containerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  receiveAnnotation: PropTypes.func.isRequired,
  switchToSingleCanvasView: PropTypes.func.isRequired,
  TargetComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  targetProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  windowViewType: PropTypes.string.isRequired,
};

CanvasAnnotationsWrapper.defaultProps = {
  annotationsOnCanvases: {},
  canvases: [],
  containerRef: null,
};

/** TODO this logic is duplicated*/
function mapStateToProps(state, { targetProps: { windowId } }) {
  const canvases = getVisibleCanvases(state, { windowId });
  const annotationsOnCanvases = {};
  const annotationCreationCompanionWindows = getCompanionWindowsForContent(state, { content: 'annotationCreation', windowId });
  let annonationEditCompanionWindowIsOpened = true;

  if (Object.keys(annotationCreationCompanionWindows).length !== 0) {
    annonationEditCompanionWindowIsOpened = false;
  }

  canvases.forEach((canvas) => {
    const anno = state.annotations[canvas.id];
    if (anno) {
      annotationsOnCanvases[canvas.id] = anno;
    }
  });
  return {
    annonationEditCompanionWindowIsOpened,
    annotationsOnCanvases,
    canvases,
    config: state.config,
    windowViewType: getWindowViewType(state, {windowId}),
  };
}

/** */
const mapDispatchToProps = (dispatch, props, annotationEdit) => ({
  addCompanionWindow: (content, additionalProps) => dispatch(
    actions.addCompanionWindow(props.targetProps.windowId, { content, ...additionalProps }),
  ),
  receiveAnnotation: (targetId, id, annotation) => dispatch(
    actions.receiveAnnotation(targetId, id, annotation),
  ),
  switchToSingleCanvasView: () => dispatch(
    actions.setWindowViewType(props.targetProps.windowId, 'single'),
  ),
});

export default {
  component: CanvasAnnotationsWrapper,
  mapDispatchToProps,
  mapStateToProps,
  mode: 'wrap',
  target: 'CanvasAnnotations',
};
