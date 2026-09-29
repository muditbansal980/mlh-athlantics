"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import { SKATER_JUMPS_DETAIL } from "./data"; 

export default function SkaterJumpsPage() {
  return (
    <ExerciseDetailSkeleton data={SKATER_JUMPS_DETAIL} />
  );
}