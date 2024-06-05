"use strict";
import Halfedge from "./halfedge";

export default class Edge {
	halfedge: Halfedge|undefined ;
	index: number;

	constructor() {
		this.halfedge = undefined;
		this.index = -1; // an ID between 0 and |E| - 1, where |E| is the number of edges in a mesh
	}
	onBoundary() {
		return (this.halfedge!.onBoundary || this.halfedge!.twin!.onBoundary);
	}

	toString() {
		return this.index;
	}
}
