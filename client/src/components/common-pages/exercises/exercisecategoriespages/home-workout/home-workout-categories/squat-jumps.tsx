"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import { SQUAT_JUMPS_DETAIL} from "./data"; 

export default function SquatJumpsPage() {
  return (
    <ExerciseDetailSkeleton data={SQUAT_JUMPS_DETAIL} />
  );
}