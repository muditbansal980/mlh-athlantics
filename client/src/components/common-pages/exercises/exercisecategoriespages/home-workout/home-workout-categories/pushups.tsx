"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import { PUSH_UPS_DETAIL } from "./data"; 

export default function PushUpsPage() {
  return (
    <ExerciseDetailSkeleton data={PUSH_UPS_DETAIL} />
  );
}