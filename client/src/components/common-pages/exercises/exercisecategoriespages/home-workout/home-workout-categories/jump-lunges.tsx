"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import { JUMP_LUNGES_DETAIL } from "./data"; 

export default function JumpLungesPage() {
  return (
    <ExerciseDetailSkeleton data={JUMP_LUNGES_DETAIL} />
  );
}