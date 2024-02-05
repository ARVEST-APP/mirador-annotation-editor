import {exportStageSVG} from "react-konva-to-svg";
import WebAnnotation from "./WebAnnotation";
import {v4 as uuid} from "uuid";
import axios from 'axios';

/** Extract time information from annotation target */
export function timeFromAnnoTarget(annotarget) {
  console.info('TODO proper time extraction from: ', annotarget);
  // TODO w3c media fragments: t=,10 t=5,
  const r = /t=([0-9.]+),([0-9.]+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return [0, 0];
  }
  return [Number(r[1]), Number(r[2])];
}

/** Extract xywh from annotation target */
export function geomFromAnnoTarget(annotarget) {
  console.info('TODO proper xywh extraction from: ', annotarget);
  const r = /xywh=((-?[0-9]+,?)+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return '';
  }
  return r[1];
}

export const OVERLAY_TOOL = {
  CURSOR: 'cursor',
  DELETE: 'delete',
  EDIT: 'edit',
  IMAGE: 'image',
  SHAPE: 'shapes',
  TEXT: 'text',
};

export const SHAPES_TOOL = {
  ARROW: 'arrow',
  ELLIPSE: 'ellipse',
  FREEHAND: 'freehand',
  POLYGON: 'polygon',
  RECTANGLE: 'rectangle',
  SHAPES: 'shapes',
};

export function isShapesTool(activeTool) {
  // Find if active tool in the list of overlay tools. I want a boolean in return
  return Object.values(SHAPES_TOOL).find((tool) => tool === activeTool) ;
}

/**
 * Get SVG picture containing all the stuff draw in the stage (Konva Stage).
 * This image will be put in overlay of the iiif media
 */
export async function getSvg(windowId) {
  const stage = window.Konva.stages.find((s) => s.attrs.id === windowId);
  const svg = await exportStageSVG(stage, false); // TODO clean
  console.log('SVG:', svg);
  return svg;
};


const dumbAnnotation = {
      "id": "https://preview.iiif.io/cookbook/master/recipe/0003-mvm-video/canvas/annotation/1",
      "type": "Annotation",
      "motivation": "commenting",
      "body": {
        "id": "https://files.tetras-libre.fr/dev/Hakanai/media/02_HKN-couv.jpg",
        "type": "Image",
        "format": "image/jpg",
        "value": "Test image annotation"
      },
      "target": "https://preview.iiif.io/cookbook/master/recipe/0003-mvm-video/canvas#xywh=0,0,301,400&t=0,1000"
    }
  ;

export function saveAnnotation(canvases, config, receiveAnnotation, annotation, body, t, xywh, image, drawingStateSerialized, svg, tags){
  // TODO promises not handled. Use promiseAll ?


    canvases.forEach(async (canvas) => {
    const storageAdapter = config.annotation.adapter(canvas.id);
    // const anno = new WebAnnotation({
    //   body,
    //   canvasId: canvas.id,
    //   fragsel: {
    //     t,
    //     xywh,
    //   },
    //   id: (annotation && annotation.id) || `${uuid()}`,
    //   image,
    //   drawingStateSerialized,
    //   manifestId: canvas.options.resource.id,
    //   svg,
    //   tags,
    // }).toJson();

    const anno = dumbAnnotation;
    anno.drawingState = drawingStateSerialized;

    if (annotation) {
      storageAdapter.update(anno)
          .then((annoPage) => {
            receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
          });
    } else {
      storageAdapter.create(anno)
          .then((annoPage) => {
            receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
          });
    }
  });
}

const sendFile = async () => {
    const fileContent = 'Hello, this is a test file';
    const blob = new Blob([fileContent], { type: 'text/plain' });

    const formData = new FormData();
    formData.append('file', blob);

    try {
        const response = await axios.post('http://localhost:3001/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('File Uploaded', response.data);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
