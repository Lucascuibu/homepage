'use strict';
import Mesh from './mesh';
import Vector from '../linear-algebra/vector';
import Edge from './edge';
import Face from './face';
import Halfedge from './halfedge';
import * as LinearAlgebra from '../linear-algebra';
import Corner from './corner';
import Vertex from './vertex';

let SparseMatrix = LinearAlgebra.SparseMatrix;
let Triplet = LinearAlgebra.Triplet;

export default class Geometry {
	mesh: Mesh;
	positions: Map<Vertex, LinearAlgebra.Vector>;
	/**
	 * This class represents the geometry of a {@link module:Core.Mesh Mesh}. This includes information such
	 * as the position of vertices as well as methods to compute edge lengths, corner
	 * angles, face area, normals, discrete curvatures etc.
	 * @constructor module:Core.Geometry
	 * @param {module:Core.Mesh} mesh The mesh this class describes the geometry of.
	 * @param {module:LinearAlgebra.Vector[]} positions An array containing the position of each vertex in a mesh.
	 * @param {boolean} normalizePositions flag to indicate whether positions should be normalized. Default value is true.
	 * @property {module:Core.Mesh} mesh The mesh this class describes the geometry of.
	 * @property {Object} positions A dictionary mapping each vertex to a normalized position.
	 */
	constructor(mesh: Mesh, positions: LinearAlgebra.Vector[], normalizePositions: boolean = true) {
		this.mesh = mesh;
		this.positions = new Map<Vertex, LinearAlgebra.Vector>();

		for (let i = 0; i < positions.length; i++) {
			let v = this.mesh.vertices[i];
			let p = positions[i];
			this.positions.set(v, p);
		}

		if (normalizePositions) {
			normalize(this.positions, mesh.vertices);
		}
	}

	/**
	 * Computes the vector along a halfedge.
	 * @method module:Core.Geometry#vector
	 * @param {module:Core.Halfedge} h The halfedge along which the vector needs to be computed.
	 * @returns {module:LinearAlgebra.Vector}
	 */
	vector(h: Halfedge): LinearAlgebra.Vector | null {
		if (h.vertex && h.next && h.next.vertex) {
			let a = this.positions.get(h.vertex);
			let b = this.positions.get(h.next.vertex);
			if (a && b) {
				return b.minus(a);
			}
		}
		return null; // 或者抛出错误，或者返回一个默认的 Vector，取决于您的需求
	}

	/**
	 * Computes the length of an edge.
	 * @method module:Core.Geometry#length
	 * @param {module:Core.Edge} e The edge whose length needs to be computed.
	 * @returns {number}
	 */
	length(e: Edge): number | null {
		if (!e.halfedge) {
			return null;
		}
		const vector = this.vector(e.halfedge);
		return vector ? vector.norm() : null;
	}

	/**
	 * Computes the midpoint of an edge.
	 * @method module:Core.Geometry#midpoint
	 * @param {module:Core.Edge} e The edge whose midpoint needs to be computed.
	 * @returns {number}
	 */
	midpoint(e: Edge): LinearAlgebra.Vector | null {
		let h = e.halfedge;
		if (!h) return null; // Early return if halfedge is not defined
		let a = this.positions.get(h.vertex!); // Using non-null assertion for vertex
		let b = this.positions.get(h.twin!.vertex!); // Using optional chaining for twin and its vertex
		return a!.plus(b!).over(2);
	}

	/**
	 * Computes the mean edge length of all the edges in a mesh.
	 * @method module:Core.Geometry#meanEdgeLength
	 * @returns {number}
	 */
	meanEdgeLength() {
		let sum = 0;
		let edges = this.mesh.edges;
		for (let e of edges) {
			sum += this.length(e)!;
		}

		return sum / edges.length;
	}

	/**
	 * Computes the area of a face.
	 * @method module:Core.Geometry#area
	 * @param {module:Core.Face} f The face whose area needs to be computed.
	 * @returns {number}
	 */
	area(f: Face) {
		if (f.isBoundaryLoop()) return 0.0;

		let u = this.vector(f!.halfedge!)!;
		let v = this.vector(f!.halfedge!.prev!)!.negated();

		return 0.5 * u.cross(v).norm();
	}

	/**
	 * Computes the total surface area of a mesh.
	 * @method module:Core.Geometry#totalArea
	 * @returns {number}
	 */
	totalArea() {
		let sum = 0.0;
		for (let f of this.mesh.faces) {
			sum += this.area(f);
		}

		return sum;
	}

	/**
	 * Computes the normal of a face.
	 * @method module:Core.Geometry#faceNormal
	 * @param {module:Core.Face} f The face whose normal needs to be computed.
	 * @returns {module:LinearAlgebra.Vector}
	 */
	faceNormal(f: Face) {
		if (f.isBoundaryLoop()) return undefined;

		let u = this.vector(f!.halfedge!)!;
		let v = this.vector(f!.halfedge!.prev!)!.negated();

		return u.cross(v).unit();
	}

	/**
	 * Computes the centroid of a face.
	 * @method module:Core.Geometry#centroid
	 * @param {module:Core.Face} f The face whose centroid needs to be computed.
	 * @returns {module:LinearAlgebra.Vector}
	 */
	centroid(f: Face) {
		let h = f.halfedge!;
		let a = this.positions.get(h!.vertex!)!;
		let b = this.positions.get(h!.next!.vertex!)!;
		let c = this.positions.get(h!.prev!.vertex!)!;

		if (f.isBoundaryLoop()) return a.plus(b).over(2);

		return a.plus(b).plus(c).over(3);
	}

	/**
	 * Computes the circumcenter of a face.
	 * @method module:Core.Geometry#circumcenter
	 * @param {module:Core.Face} f The face whose circumcenter needs to be computed.
	 * @returns {module:LinearAlgebra.Vector}
	 */
	circumcenter(f: Face) {
		let h = f.halfedge;
		let a = this.positions.get(h!.vertex!)!;
		let b = this.positions.get(h!.next!.vertex!)!;
		let c = this.positions.get(h!.prev!.vertex!)!;

		if (f.isBoundaryLoop()) return a.plus(b).over(2);

		let ac = c.minus(a);
		let ab = b.minus(a);
		let w = ab.cross(ac);

		let u = w.cross(ab).times(ac.norm2());
		let v = ac.cross(w).times(ab.norm2());
		let x = u.plus(v).over(2 * w.norm2());

		return x.plus(a);
	}

	/**
	 * Computes an orthonormal bases for a face.
	 * @method module:Core.Geometry#orthonormalBases
	 * @param {module:Core.Face} f The face on which the orthonormal bases needs to be computed.
	 * @returns {module:LinearAlgebra.Vector[]} An array containing two orthonormal vectors tangent to the face.
	 */
	orthonormalBases(f: Face) {
		let e1 = this.vector(f!.halfedge!)!.unit();

		let normal = this.faceNormal(f)!;
		let e2 = normal.cross(e1);

		return [e1, e2];
	}

	/**
	 * Computes the angle (in radians) at a corner.
	 * @method module:Core.Geometry#angle
	 * @param {module:Core.Corner} c The corner at which the angle needs to be computed.
	 * @returns {number} The angle clamped between 0 and π.
	 */
	angle(c: Corner) {
		let u = this.vector(c!.halfedge!.prev!)!.unit();
		let v = this.vector(c!.halfedge!.next!)!.negated().unit();

		return Math.acos(Math.max(-1.0, Math.min(1.0, u.dot(v))));
	}

	/**
	 * Computes the cotangent of the angle opposite to a halfedge.
	 * @method module:Core.Geometry#cotan
	 * @param {module:Core.Halfedge} h The halfedge opposite to the angle whose cotangent needs to be computed.
	 * @returns {number}
	 */
	cotan(h: Halfedge) {
		if (h.onBoundary) return 0.0;

		let u = this.vector(h!.prev!)!;
		let v = this.vector(h!.next!)!.negated();

		return u.dot(v) / u.cross(v).norm();
	}

	/**
	 * Computes the signed angle (in radians) between two adjacent faces.
	 * @method module:Core.Geometry#dihedralAngle
	 * @param {module:Core.Halfedge} h The halfedge (shared by the two adjacent faces) on which
	 * the dihedral angle is computed.
	 * @returns {number} The dihedral angle.
	 */
	dihedralAngle(h: Halfedge) {
		if (h.onBoundary || h.twin!.onBoundary) return 0.0;

		let n1 = this.faceNormal(h!.face!)!;
		let n2 = this.faceNormal(h!.twin!.face!)!;
		let w = this.vector(h)!.unit();

		let cosTheta = n1.dot(n2);
		let sinTheta = n1.cross(n2).dot(w);

		return Math.atan2(sinTheta, cosTheta);
	}

	/**
	 * Computes the barycentric dual area of a vertex.
	 * @method module:Core.Geometry#barycentricDualArea
	 * @param {module:Core.Vertex} v The vertex whose barycentric dual area needs to be computed.
	 * @returns {number}
	 */
	barycentricDualArea(v: Vertex) {
		let area = 0.0;
		for (let f of v.adjacentFaces()) {
			area += this.area(f!) / 3;
		}

		return area;
	}

	/**
	 * Computes the circumcentric dual area of a vertex.
	 * @see {@link http://cs.cmu.edu/~kmcrane/Projects/Other/TriangleAreasCheatSheet.pdf}
	 * @method module:Core.Geometry#circumcentricDualArea
	 * @param {module:Core.Vertex} v The vertex whose circumcentric dual area needs to be computed.
	 * @returns {number}
	 */
	circumcentricDualArea(v: Vertex) {
		let area = 0.0;
		for (let h of v.adjacentHalfedges()) {
			let u2 = this.vector(h!.prev!)!.norm2();
			let v2 = this.vector(h!)!.norm2();
			let cotAlpha = this.cotan(h!.prev!);
			let cotBeta = this.cotan(h!);

			area += (u2 * cotAlpha + v2 * cotBeta) / 8;
		}

		return area;
	}

	/**
	 * Computes the normal at a vertex using the "equally weighted" method.
	 * @method module:Core.Geometry#vertexNormalEquallyWeighted
	 * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
	 * @returns {module:LinearAlgebra.Vector}
	 */
	vertexNormalEquallyWeighted(v: Vertex) {
		let n = new Vector();
		for (let f of v.adjacentFaces()) {
			let normal = this.faceNormal(f!);

			n.incrementBy(normal!);
		}

		n.normalize();

		return n;
	}

	/**
	 * Computes the normal at a vertex using the "face area weights" method.
	 * @method module:Core.Geometry#vertexNormalAreaWeighted
	 * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
	 * @returns {module:LinearAlgebra.Vector}
	 */
	vertexNormalAreaWeighted(v: Vertex) {
		let n = new Vector();
		for (let f of v.adjacentFaces()) {
			let normal = this.faceNormal(f!);
			let area = this.area(f!);

			n.incrementBy(normal!.times(area));
		}

		n.normalize();

		return n;
	}

	/**
	 * Computes the normal at a vertex using the "tip angle weights" method.
	 * @method module:Core.Geometry#vertexNormalAngleWeighted
	 * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
	 * @returns {module:LinearAlgebra.Vector}
	 */
	vertexNormalAngleWeighted(v: Vertex) {
		let n = new Vector();
		for (let c of v.adjacentCorners()) {
			let normal = this.faceNormal(c!.halfedge!.face!);
			let angle = this.angle(c!);

			n.incrementBy(normal!.times(angle));
		}

		n.normalize();

		return n;
	}

	/**
	 * Computes the normal at a vertex using the "gauss curvature" method.
	 * @method module:Core.Geometry#vertexNormalGaussCurvature
	 * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
	 * @returns {module:LinearAlgebra.Vector}
	 */
	vertexNormalGaussCurvature(v: Vertex) {
		let n = new Vector();
		for (let h of v.adjacentHalfedges()) {
			let weight = (0.5 * this.dihedralAngle(h!)) / this.length(h!.edge!)!;

			n.decrementBy(this.vector(h!)!.times(weight));
		}

		n.normalize();

		return n;
	}

	/**
	 * Computes the normal at a vertex using the "mean curvature" method (same as the "area gradient" method).
	 * @method module:Core.Geometry#vertexNormalMeanCurvature
	 * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
	 * @returns {module:LinearAlgebra.Vector}
	 */
	vertexNormalMeanCurvature(v: Vertex) {
		let n = new Vector();
		for (let h of v.adjacentHalfedges()) {
			let weight = 0.5 * (this.cotan(h!) + this.cotan(h!.twin!));

			n.decrementBy(this.vector(h!)!.times(weight));
		}

		n.normalize();

		return n;
	}

	/**
	 * Computes the normal at a vertex using the "inscribed sphere" method.
	 * @method module:Core.Geometry#vertexNormalSphereInscribed
	 * @param {module:Core.Vertex} v The vertex on which the normal needs to be computed.
	 * @returns {module:LinearAlgebra.Vector}
	 */
	vertexNormalSphereInscribed(v: Vertex) {
		let n = new Vector();
		for (let c of v.adjacentCorners()) {
			let u = this.vector(c!.halfedge!.prev!);
			let v = this.vector(c!.halfedge!.next!)!.negated();

			n.incrementBy(u!.cross(v).over(u!.norm2() * v.norm2()));
		}

		n.normalize();

		return n;
	}

	/**
	 * Computes the angle defect at a vertex (= 2π minus the sum of incident angles
	 * at an interior vertex or π minus the sum of incident angles at a boundary vertex).
	 * @method module:Core.Geometry#angleDefect
	 * @param {module:Core.Vertex} v The vertex whose angle defect needs to be computed.
	 * @returns {number}
	 */
	angleDefect(v: Vertex) {
		let angleSum = 0.0;
		for (let c of v.adjacentCorners()) {
			angleSum += this.angle(c!);
		}

		return v.onBoundary() ? Math.PI - angleSum : 2 * Math.PI - angleSum;
	}

	/**
	 * Computes the (integrated) scalar gauss curvature at a vertex.
	 * @method module:Core.Geometry#scalarGaussCurvature
	 * @param {module:Core.Vertex} v The vertex whose gauss curvature needs to be computed.
	 * @returns {number}
	 */
	scalarGaussCurvature(v: Vertex) {
		return this.angleDefect(v);
	}

	/**
	 * Computes the (integrated) scalar mean curvature at a vertex.
	 * @method module:Core.Geometry#scalarMeanCurvature
	 * @param {module:Core.Vertex} v The vertex whose mean curvature needs to be computed.
	 * @returns {number}
	 */
	scalarMeanCurvature(v: Vertex) {
		let sum = 0.0;
		for (let h of v.adjacentHalfedges()) {
			sum += 0.5 * this.length(h!.edge!)! * this.dihedralAngle(h!);
		}

		return sum;
	}

	/**
	 * Computes the total angle defect (= 2π times the euler characteristic of the mesh).
	 * @method module:Core.Geometry#totalAngleDefect
	 * @returns {number}
	 */
	totalAngleDefect() {
		let totalDefect = 0.0;
		for (let v of this.mesh.vertices) {
			totalDefect += this.angleDefect(v);
		}

		return totalDefect;
	}

	/**
	 * Computes the (pointwise) minimum and maximum principal curvature values at a vertex.
	 * @method module:Core.Geometry#principalCurvatures
	 * @param {module:Core.Vertex} v The vertex on which the principal curvatures need to be computed.
	 * @returns {number[]} An array containing the minimum and maximum principal curvature values at a vertex.
	 */
	principalCurvatures(v: Vertex) {
		let A = this.circumcentricDualArea(v);
		let H = this.scalarMeanCurvature(v) / A;
		let K = this.angleDefect(v) / A;

		let discriminant = H * H - K;
		if (discriminant > 0) discriminant = Math.sqrt(discriminant);
		else discriminant = 0;

		let k1 = H - discriminant;
		let k2 = H + discriminant;

		return [k1, k2];
	}

	/**
	 * Builds a sparse laplace matrix. The laplace operator is negative semidefinite;
	 * instead we build a positive definite matrix by multiplying the entries of the
	 * laplace matrix by -1 and shifting the diagonal elements by a small constant (e.g. 1e-8).
	 * @method module:Core.Geometry#laplaceMatrix
	 * @param {Object} vertexIndex A dictionary mapping each vertex of a mesh to a unique index.
	 * @returns {module:LinearAlgebra.SparseMatrix}
	 */
	laplaceMatrix(vertexIndex: Map<Vertex, number>) {
		let V = this.mesh.vertices.length;
		let T = new Triplet(V, V);
		for (let v of this.mesh.vertices) {
			let i = vertexIndex.get(v)!;
			let sum = 1e-8;

			for (let h of v.adjacentHalfedges()) {
				let j = vertexIndex.get(h!.twin!.vertex!)!;
				let weight = (this.cotan(h!) + this.cotan(h!.twin!)) / 2;
				sum += weight;

				T.addEntry(-weight, i, j);
			}

			T.addEntry(sum, i, i);
		}

		return SparseMatrix.fromTriplet(T);
	}

	/**
	 * Builds a sparse diagonal mass matrix containing the barycentric dual area of each vertex
	 * of a mesh.
	 * @method module:Core.Geometry#massMatrix
	 * @param {Object} vertexIndex A dictionary mapping each vertex of a mesh to a unique index.
	 * @returns {module:LinearAlgebra.SparseMatrix}
	 */
	massMatrix(vertexIndex: Map<Vertex, number>) {
		let V = this.mesh.vertices.length;
		let T = new Triplet(V, V);
		for (let v of this.mesh.vertices) {
			let i = vertexIndex.get(v)!;

			T.addEntry(this.barycentricDualArea(v), i, i);
		}

		return SparseMatrix.fromTriplet(T);
	}

	/**
	 * Builds a sparse complex laplace matrix. The laplace operator is negative semidefinite;
	 * instead we build a positive definite matrix by multiplying the entries of the
	 * laplace matrix by -1 and shifting the diagonal elements by a small constant (e.g. 1e-8).
	 * @method module:Core.Geometry#complexLaplaceMatrix
	 * @param {Object} vertexIndex A dictionary mapping each vertex of a mesh to a unique index.
	 * @returns {module:LinearAlgebra.ComplexSparseMatrix}
	 */
	complexLaplaceMatrix(vertexIndex: Map<Vertex, number>) {
		let V = this.mesh.vertices.length;
		let T = new LinearAlgebra.ComplexTriplet(V, V);
		for (let v of this.mesh.vertices) {
			let i = vertexIndex.get(v)!;
			let sum = 1e-8;

			for (let h of v.adjacentHalfedges()) {
				let j = vertexIndex.get(h!.twin!.vertex!)!;
				let weight = (this.cotan(h!) + this.cotan(h!.twin!)) / 2;
				sum += weight;

				T.addEntry(new LinearAlgebra.Complex(-weight), i, j);
				// T.addEntry(-weight, i, j);/
			}

			T.addEntry(new LinearAlgebra.Complex(sum), i, i);
			// T.addEntry(sum, i, i);/
		}

		return LinearAlgebra.ComplexSparseMatrix.fromTriplet(T);
	}
}

/**
 * Centers a mesh about the origin and rescales it to unit radius.
 * @global
 * @function module:Core.normalize
 * @param {module:LinearAlgebra.Vector[]} positions The position of each vertex in the vertices array.
 * @param {module:Core.Vertex[]} vertices The vertices of a mesh.
 * @param {boolean} rescale A flag indicating whether mesh positions should be scaled to a unit radius.
 */
function normalize(positions: Map<Vertex, LinearAlgebra.Vector>, vertices: Vertex[], rescale = true) {
	// compute center of mass
	let N = vertices.length;
	let cm = new Vector();
	for (let v of vertices) {
		let p = positions.get(v)!;

		cm.incrementBy(p);
	}
	cm.divideBy(N);

	// translate to origin and determine radius
	let radius = -1;
	for (let v of vertices) {
		let p = positions.get(v)!;

		p.decrementBy(cm);
		radius = Math.max(radius, p.norm());
	}

	// rescale to unit radius
	if (rescale) {
		for (let v of vertices) {
			let p = positions.get(v)!;

			p.divideBy(radius);
		}
	}
}
