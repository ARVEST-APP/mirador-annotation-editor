import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layer } from 'react-konva';
import Rectangle from './Rectangle';
import EllipseNode from './EllipseNode';
import TextNode from './TextNode';
import ArrowNode from './ArrowNode';
import Polygon from './Polygon';
import Freehand from './Freehand';
import ImageShape from './Image';
import ArcNode from './ArcNode';

/** Loads Konva and display in function of their type */
function ParentComponent({
  activeTool,
  displayMode,
  handleDragEnd,
  handleDragStart,
  isMouseOverSave,
  onShapeClick,
  onTransform,
  scale,
  selectedShapeId,
  shapes,
  trview,
}) {
  const [selectedShape, setSelectedShape] = useState(null);

  useEffect(() => {
  }, [shapes, selectedShapeId]);

  useEffect(() => {

  }, [selectedShape]);

  /**
    * Triggered onShapeClick provided function when a shape is clicked
    * @param {object} shape
    */
  const handleShapeClick = (shape) => {
    onShapeClick(shape);
    setSelectedShape(shape);
  };

  return (
    <Layer
      scaleX={scale}
      scaleY={scale}
    >
      {/* eslint-disable-next-line consistent-return */}
      {shapes.map((shape, i) => {
        // eslint-disable-next-line max-len
        const isSelected = selectedShapeId === shape.id && !isMouseOverSave && trview;
        switch (shape.type) {
          case 'rectangle':
            return (
              <Rectangle
                {...{
                  activeTool,
                  displayMode,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={shape.id}
                displayMode={displayMode}
              />
            );
          case 'text':
            return (
              <TextNode
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                text={shape.text}
                key={shape.id}
              />
            );
          case 'ellipse':
            return (
              <EllipseNode
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={shape.id}
              />
            );
          case 'arc':
            return (
              <ArcNode
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={shape.id}
              />
            );
          case 'freehand':
            return (
              <Freehand
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={shape.id}
              />
            );
          case 'polygon':
            return (
              <Polygon
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={shape.id}
              />
            );
          case 'arrow':
            return (
              <ArrowNode
                {...{
                  activeTool,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                }}
                key={shape.id}
              />
            );
          case 'image':
            return (
              <ImageShape
                {...{
                  activeTool,
                  displayMode,
                  handleDragEnd,
                  handleDragStart,
                  isSelected,
                  onShapeClick: handleShapeClick,
                  onTransform,
                  shape,
                  src: shape.src,
                }}
                key={shape.id}
              />
            );
        }
      })}
    </Layer>
  );
}

ParentComponent.propTypes = {
  activeTool: PropTypes.string.isRequired,
  displayMode: PropTypes.string.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  isMouseOverSave: PropTypes.bool.isRequired,
  onShapeClick: PropTypes.func.isRequired,
  onTransform: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
  selectedShapeId: PropTypes.string.isRequired,
  shapes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    rotation: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    type: PropTypes.string,
    url: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  })).isRequired,
  trview: PropTypes.bool.isRequired,
};
export default ParentComponent;
