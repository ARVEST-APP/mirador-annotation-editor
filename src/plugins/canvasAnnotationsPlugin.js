import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getVisibleCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import * as actions from 'mirador/dist/es/src/state/actions';
import { getWindowViewType } from 'mirador/dist/es/src/state/selectors';
import {
  getCompanionWindowsForContent,
} from 'mirador/dist/es/src/state/selectors/companionWindows';
import CanvasListItem from '../CanvasListItem';
import AnnotationActionsContext from '../AnnotationActionsContext';
import SingleCanvasDialog from '../SingleCanvasDialog';
import translations from '../locales/locales';

/** Functional Component */
function CanvasAnnotationsWrapper({
  addCompanionWindow,
  annotationsOnCanvases = {},
  canvases = [],
  config,
  receiveAnnotation,
  switchToSingleCanvasView,
  TargetComponent,
  targetProps,
  windowViewType,
  containerRef,
  annotationEditCompanionWindowIsOpened,
  t,
}) {
  const [singleCanvasDialogOpen, setSingleCanvasDialogOpen] = useState(false);

  /** */
  const toggleSingleCanvasDialogOpen = () => {
    setSingleCanvasDialogOpen((prev) => !prev);
  };

  const props = {
    ...targetProps,
    listContainerComponent: CanvasListItem,
  };

  return (
    <AnnotationActionsContext.Provider
      value={{
        addCompanionWindow,
        annotationEditCompanionWindowIsOpened,
        annotationsOnCanvases,
        canvases,
        config,
        receiveAnnotation,
        storageAdapter: config.annotation.adapter,
        toggleSingleCanvasDialogOpen,
        windowId: targetProps.windowId,
        windowViewType,
        t,
      }}
    >
      <TargetComponent {...props} ref={containerRef} />
      {windowViewType !== 'single' && (
        <SingleCanvasDialog
          handleClose={toggleSingleCanvasDialogOpen}
          open={singleCanvasDialogOpen}
          switchToSingleCanvasView={switchToSingleCanvasView}
        />
      )}
    </AnnotationActionsContext.Provider>
  );
}

CanvasAnnotationsWrapper.propTypes = {
  addCompanionWindow: PropTypes.func.isRequired,
  annotationEditCompanionWindowIsOpened: PropTypes.bool.isRequired,
  annotationsOnCanvases: PropTypes.shape({
    id: PropTypes.string,
    isFetching: PropTypes.bool,
    json: PropTypes.shape({
      id: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.shape({
            format: PropTypes.string,
            id: PropTypes.string,
            value: PropTypes.string,
          }),
          drawingState: PropTypes.string,
          id: PropTypes.string,
          manifestNetwork: PropTypes.string,
          motivation: PropTypes.string,
          target: PropTypes.string,
          type: PropTypes.string,
        }),
      ),
      type: PropTypes.string,
    }),
  }).isRequired,
  canvases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      index: PropTypes.number,
    }),
  ).isRequired,
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
  t: PropTypes.func.isRequired,
  TargetComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  targetProps: PropTypes.object.isRequired,
  windowViewType: PropTypes.string.isRequired,
};

/** TODO this logic is duplicated */
function mapStateToProps(state, { targetProps: { windowId } }) {
  const canvases = getVisibleCanvases(state, { windowId });
  const annotationsOnCanvases = {};
  const annotationCreationCompanionWindows = getCompanionWindowsForContent(state, {
    content: 'annotationCreation',
    windowId,
  });
  let annotationEditCompanionWindowIsOpened = true;

  if (Object.keys(annotationCreationCompanionWindows).length !== 0) {
    annotationEditCompanionWindowIsOpened = false;
  }

  canvases.forEach((canvas) => {
    const anno = state.annotations[canvas.id];
    if (anno) {
      annotationsOnCanvases[canvas.id] = anno;
    }
  });
  return {
    annotationEditCompanionWindowIsOpened,
    annotationsOnCanvases,
    canvases,
    config: {
      ...state.config,
      translations,
    },
    windowViewType: getWindowViewType(state, { windowId }),
  };
}

/** */
const mapDispatchToProps = (dispatch, props, annotationEditCompanionWindowIsOpened) => ({
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

const CanvasAnnotationsWrapperContainer = {
  component: CanvasAnnotationsWrapper,
  mapDispatchToProps,
  mapStateToProps,
  mode: 'wrap',
  target: 'CanvasAnnotations',
};

export default CanvasAnnotationsWrapperContainer;
