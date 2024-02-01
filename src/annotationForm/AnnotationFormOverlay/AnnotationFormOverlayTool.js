import ToggleButton from '@mui/material/ToggleButton';
import RectangleIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import PolygonIcon from '@mui/icons-material/Timeline';
import GestureIcon from '@mui/icons-material/Gesture';
import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AnnotationFormOverlayToolOptions from './AnnotationFormOverlayToolOptions';
import { isShapesTool, SHAPES_TOOL } from '../../AnnotationCreationUtils';

// TODO WIP code duplicated
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '&:first-of-type': {
    borderRadius: theme.shape.borderRadius,
  },
  '&:not(:first-of-type)': {
    borderRadius: theme.shape.borderRadius,
  },
  border: 'none',
  margin: theme.spacing(0.5),
}));

/** All the form part for the overlay view */
function AnnotationFormOverlayTool({ toolState, updateToolState }) {
  /** Change the active overlay tool */
  const changeTool = (e, tool) => {
    updateToolState({
      ...toolState,
      activeTool: tool,
    });
  };

  return (
    <>
      {
        isShapesTool(toolState.activeTool) && (
          <StyledToggleButtonGroup
            value={toolState.activeTool} // State or props ?
            exclusive
            onChange={changeTool}
            aria-label="tool selection"
            size="small"
          >
            <ToggleButton value={SHAPES_TOOL.RECTANGLE} aria-label="add a rectangle">
              <RectangleIcon />
            </ToggleButton>
            <ToggleButton value={SHAPES_TOOL.ELLIPSE} aria-label="add a circle">
              <CircleIcon />
            </ToggleButton>
            <ToggleButton value={SHAPES_TOOL.ARROW} aria-label="add an arrow">
              <ArrowOutwardIcon />
            </ToggleButton>
            <ToggleButton value={SHAPES_TOOL.POLYGON} aria-label="add a polygon">
              <PolygonIcon />
            </ToggleButton>
            <ToggleButton value={SHAPES_TOOL.FREEHAND} aria-label="free hand polygon">
              <GestureIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>
        )
      }

      <AnnotationFormOverlayToolOptions
        toolState={toolState}
        updateToolState={updateToolState}
      />
    </>
  );
}

AnnotationFormOverlayTool.propTypes = {
  toolState: PropTypes.shape({
    activeTool: PropTypes.string.isRequired,
    closedMode: PropTypes.bool.isRequired,
    fillColor: PropTypes.string.isRequired,
    strokeColor: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    updateColor: PropTypes.func.isRequired,
  }).isRequired,
  updateToolState: PropTypes.func.isRequired,

};

export default AnnotationFormOverlayTool;
