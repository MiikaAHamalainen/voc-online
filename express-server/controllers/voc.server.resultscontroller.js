/**
 * ResultsController - handles results for CalcPoint
 */

//import models
import { CalcPoint, Building, GFS, Result } from '../models/voc.server.building-model';
import {dynamicSort} from '../utils/utils.js';
import * as vocController from '../controllers/voc.server.controller';

export const getResultsForCalcPoint = (req, res) => {
  CalcPoint.findById(req.params.id)
    .populate({
      path: 'results',
      model: 'Results',
      populate: {
        path: 'files',

        model: 'GFS'
      }
    }).exec((err, calcPoint) => {
      if (err) {
        return res.json({ 'success': false, 'message': 'Virhe' });
      }

      const results = calcPoint.results;
      results.sort(dynamicSort("resultdate", "desc"));

      return res.json({ 'success': true, 'message': 'Kohteet haettu onnistuneesti', results, calcPoint });
    });
}

export const addMeasurementResult = (req, res) => {
  const newResult = new Result(req.body);
  newResult.save((err, addedResult) => {
    if (err) {
      console.log("err: " + err);
      return res.json({ 'success': false, 'message': 'Virhe' });
    }

    var parentId = addedResult.parentId;
    CalcPoint.findOne({ '_id': parentId }, function (err, calcPoint) {
      console.log("Found an object to link the file to: " + parentId);
      if (err) {
        console.log("err: " + err);
        return res.json({ 'success': false, 'message': 'Object not found!' });
      }

      calcPoint.results.push(addedResult._id);

      console.log('Pushing file id: ' + addedResult._id + ' for parent: ' + parentId);

      calcPoint.save((err, updatedCalcPoint) => {
        if (err) {
          console.log("err: " + err);
          return res.json({ 'success': false, 'message': 'File upload failed, could not add parent relation' });
        }
        console.log("Result added for CalcPoint: " + updatedCalcPoint._id);
        return res.json({ 'success': true, 'message': 'Materiaali lisätty onnistuneesti', addedResult });
      });
    })
  })
}


export const editResult = (req, res) => {
  Result.findByIdAndUpdate(req.body.id, req.body, { new: true }).populate('files').exec((err, result) => {
    if (err) {
      return res.json({ 'success': false, 'message': 'Virhe', 'error': err });
    }
    return res.json({ 'success': true, 'message': 'Päivitettiin onnistuneesti', result });
  });
}

export const deleteResult = (req, res) => {

  if ( req.params.id ) {
    console.log("Removing files linked to result: "+req.params.id+" that is going to be deleted.");
    vocController.deleteLinkedFiles(req.params.id);
  }
  Result.findByIdAndRemove(req.params.id, (err, result) => {
    if (err) {
      return res.json({ 'success': false, 'message': 'Virhe' });
    }

    var parentId = result.parentId;

    CalcPoint.findOneAndUpdate(
      { _id: parentId },
      { $pull: { results: req.params.id } },
      { new: true },
      function (err, removed) {
        if (err) { console.error(err) }
        return res.json({ 'success': true, 'message': req.params.id + ' poistettu onnistuneesti!' });
      });
  })
}