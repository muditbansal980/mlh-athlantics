"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import { PLANK_SHOULDER_TAPS_DETAIL} from "./data"; 

export default function PlankShoulderTapsPage() {
  return (
    <ExerciseDetailSkeleton data={PLANK_SHOULDER_TAPS_DETAIL} />
  );
}