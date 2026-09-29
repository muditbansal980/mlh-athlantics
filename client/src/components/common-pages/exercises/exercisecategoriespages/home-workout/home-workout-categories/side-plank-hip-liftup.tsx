"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import { SIDE_PLANK_HIP_LIFTS_DETAIL } from "./data"; 

export default function SidePlankHipLiftUpPage() {
  return (
    <ExerciseDetailSkeleton data={SIDE_PLANK_HIP_LIFTS_DETAIL} />
  );
}