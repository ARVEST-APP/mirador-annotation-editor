import React, { useEffect, useState } from 'react';
import {Grid, TextField} from '@mui/material';
import uuid from 'draft-js/lib/uuid';
import Typography from '@mui/material/Typography';
import AnnotationFormFooter from './AnnotationFormFooter';
import { maeTargetToIiifTarget, template } from '../AnnotationFormUtils';
import TargetFormSection from './TargetFormSection';
import { getSvg } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';

export default function TaggingTemplate(
  {
    annotation,
    currentTime,
    mediaType,
    overlay,
    setCurrentTime,
    setSeekTo,
    windowId,
    canvases,
    closeFormCompanionWindow,
    saveAnnotation,
    getMediaAudio,
  },
) {
  let maeAnnotation = annotation;

  if (!maeAnnotation.id) {
    // If the annotation does not have maeData, the annotation was not created with mae
    maeAnnotation = {
      body: {
        type: 'TextualBody',
        value: '',
      },
      maeData: {
        target: null,
        templateType: template.TAGGING_TYPE,
      },
      motivation: 'tagging',
      target: null,
    };
  } else if (maeAnnotation.maeData.target.drawingState && typeof maeAnnotation.maeData.target.drawingState === 'string') {
    maeAnnotation.maeData.target.drawingState = JSON.parse(maeAnnotation.maeData.target.drawingState);
  }

  const [annotationState, setAnnotationState] = useState(maeAnnotation);

  const updateTargetState = (target) => {
    const newMaeData = annotationState.maeData;
    newMaeData.target = target;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  const updateTaggingValue = (newTextValue) => {
    const newBody = annotationState.body;
    newBody.value = newTextValue;
    setAnnotationState({
      ...annotationState,
      body: newBody,
    });
  }

  /** Save function * */
  const saveFunction = () => {
    // TODO This code is not DRY, it's the same as in TextCommentTemplate.js
    const promises = canvases.map(async (canvas) => {
      // Adapt target to the canvas
      // eslint-disable-next-line no-param-reassign
      console.log(annotation.maeData);
      annotationState.maeData.target.svg = await getSvg(windowId);
      // annotationState.maeData.target.dataUrl = await getKonvaAsDataURL(windowId);
      annotationState.target = maeTargetToIiifTarget(annotationState.maeData.target, canvas.id);
      annotationState.maeData.target.drawingState = JSON.stringify(annotationState.maeData.target.drawingState);
      annotationState.maeData.target.svg = JSON.stringify(annotationState.maeData.target);
      console.log('annotationState', annotationState.target);
      // delete annotationState.maeData.target;
      return saveAnnotation(annotationState, canvas.id);
    });
    Promise.all(promises).then(() => {
      closeFormCompanionWindow();
    });
  };

  return (
    <Grid>
      <Typography variant="formSectionTitle">Tag</Typography>
      <TextField
        id="outlined-basic"
        label="Your tag here :"
        value={annotationState.body.value}
        variant="outlined"
        onChange={(event) => updateTaggingValue(event.target.value)}
      />
      <TargetFormSection
        currentTime={currentTime}
        mediaType={mediaType}
        onChangeTarget={updateTargetState}
        setCurrentTime={setCurrentTime}
        setSeekTo={setSeekTo}
        spatialTarget
        target={annotationState.maeData.target}
        timeTarget
        windowId={windowId}
        overlay={overlay}
        closeFormCompanionWindow={closeFormCompanionWindow}
        getMediaAudio={getMediaAudio}
      />
      <AnnotationFormFooter
        closeFormCompanionWindow={closeFormCompanionWindow}
        saveAnnotation={saveFunction}
      />
    </Grid>
  );
}
