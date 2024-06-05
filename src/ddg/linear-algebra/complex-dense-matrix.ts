"use strict";

import EmscriptenMemoryManager from "./emscripten-memory-manager";
import Complex from "./complex";

export default class ComplexDenseMatrix {
	data: any;
	memoryManager!: EmscriptenMemoryManager;
	/**
	 * This class represents a m by n complex matrix where every entry, including
	 * zero-valued entries, is stored explicitly. Do not create a ComplexDenseMatrix
	 * from its constructor, instead use static factory methods such as zeros,
	 * identity, ones, constant and random.
	 * @constructor module:LinearAlgebra.ComplexDenseMatrix
	 * @example
	 * let A = ComplexDenseMatrix.zeros(20, 5);
	 * let B = ComplexDenseMatrix.identity(10, 10);
	 * let C = ComplexDenseMatrix.ones(100, 1);
	 * let D = ComplexDenseMatrix.constant(new Complex(1, 2), 5, 5);
	 * let E = ComplexDenseMatrix.random(5, 20);
	 */
	constructor(data: ComplexDenseMatrix | any[][]) {
		this.data = data;
		this.memoryManager.objectList.push(this);
	}

	/**
	 * Deletes the emscripten heap allocated data of this dense matrix.
	 * @ignore
	 * @method module:LinearAlgebra.ComplexDenseMatrix#delete
	 */
	delete(): void{
		this.data.delete();
	}

	/**
	 * Initializes a m by n matrix of zeros.
	 * @method module:LinearAlgebra.ComplexDenseMatrix.zeros
	 * @param {number} m The number of rows in this complex dense matrix.
	 * @param {number} n The number of columns in this complex dense matrix.
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	static zeros(m: number, n: number = 1): ComplexDenseMatrix {
		// 创建一个 m 行 n 列的矩阵，并填充为零
		const data = Array.from({ length: m }, () => Array(n).fill(0));
		return new ComplexDenseMatrix(data);
	}

	/**
	 * Initializes a m by n identity matrix.
	 * @method module:LinearAlgebra.ComplexDenseMatrix.identity
	 * @param {number} m The number of rows in this complex dense matrix.
	 * @param {number} n The number of columns in this complex dense matrix.
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	static identity(m: any, n = 1) : ComplexDenseMatrix {
		return new ComplexDenseMatrix(ComplexDenseMatrix.identity(m, n));
	}

	/**
	 * Initializes a m by n matrix of ones.
	 * @method module:LinearAlgebra.ComplexDenseMatrix.ones
	 * @param {number} m The number of rows in this complex dense matrix.
	 * @param {number} n The number of columns in this complex dense matrix.
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	static ones(m: number, n = 1): ComplexDenseMatrix {
		return new ComplexDenseMatrix(ComplexDenseMatrix.ones(m, n));
	}

	/**
	 * Initializes a m by n constant matrix.
	 * @method module:LinearAlgebra.ComplexDenseMatrix.constant
	 * @param {module:LinearAlgebra.Complex} x The constant value stored in every entry of this complex dense matrix.
	 * @param {number} m The number of rows in this complex dense matrix.
	 * @param {number} n The number of columns in this complex dense matrix.
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	static constant(x: number, m: number, n = 1): ComplexDenseMatrix{
		return new ComplexDenseMatrix(ComplexDenseMatrix.constant(m, n, x));
	}

	/**
	 * Returns the transpose of this complex dense matrix.
	 * @method module:LinearAlgebra.ComplexDenseMatrix#transpose
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	transpose() : ComplexDenseMatrix {
		return new ComplexDenseMatrix(this.data.transpose());
	}

	/**
	 * Returns the conjugate of this complex dense matrix.
	 * @method module:LinearAlgebra.ComplexDenseMatrix#conjugate
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	conjugate(): ComplexDenseMatrix {
		return new ComplexDenseMatrix(this.data.conjugate());
	}

	/**
	 * Returns the number of rows in this complex dense matrix.
	 * @method module:LinearAlgebra.ComplexDenseMatrix#nRows
	 * @returns {number}
	 */
	nRows():number {
		return this.data.nRows();
	}

	/**
	 * Returns the number of columns in this complex dense matrix.
	 * @method module:LinearAlgebra.ComplexDenseMatrix#nCols
	 * @returns {number}
	 */
	nCols(): number {
		return this.data.nCols();
	}

	/**
	 * Computes the lInfinity, l1 or l2 norm of this complex dense matrix.
	 * @method module:LinearAlgebra.ComplexDenseMatrix#norm
	 * @param {number} n Computes the lInfinity norm if n = 0, l1 norm if n = 1
	 * and l2 norm if n = 2.
	 * @returns {number}
	 */
	norm(n = 2) : number {
		return this.data.norm(n);
	}

	/**
	 * Returns the rank of this complex dense matrix.
	 * @method module:LinearAlgebra.ComplexDenseMatrix#rank
	 * @returns {number}
	 */
	rank() : number{
		return this.data.rank();
	}

	/**
	 * Sums all the entries in this complex dense matrix.
	 * @method module:LinearAlgebra.ComplexDenseMatrix#sum
	 * @returns {module:LinearAlgebra.Complex}
	 */
	sum() : Complex{
		let u = this.data.sum();
		return new Complex(u);
	}

	/**
	 * Extracts a sub-matrix in the range [r0, r1) x [c0, c1), i.e., a matrix
	 * of size (r1 - r0) x (c1 - c0) starting at indices (r0, c0).
	 * @method module:LinearAlgebra.ComplexDenseMatrix#subMatrix
	 * @param {number} r0 The start row index.
	 * @param {number} r1 The end row index (not included).
	 * @param {number} c0 The start column index.
	 * @param {number} c1 The end column index (not included).
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	subMatrix(r0: any, r1: any, c0 = 0, c1 = 1) : ComplexDenseMatrix{
		return new ComplexDenseMatrix(this.data.subMatrix(r0, r1, c0, c1));
	}

	/**
	 * A += B
	 * @method module:LinearAlgebra.ComplexDenseMatrix#incrementBy
	 * @param {module:LinearAlgebra.ComplexDenseMatrix} B The complex dense matrix added to this complex dense matrix.
	 */
	incrementBy(B: { data: any; }): void{
		this.data.incrementBy(B.data);
	}

	/**
	 * A -= B
	 * @method module:LinearAlgebra.ComplexDenseMatrix#decrementBy
	 * @param {module:LinearAlgebra.ComplexDenseMatrix} B The complex dense matrix subtracted from this complex dense matrix.
	 */
	decrementBy(B: { data: any; }): void{
		this.data.decrementBy(B.data);
	}

	/**
	 * A *= s
	 * @method module:LinearAlgebra.ComplexDenseMatrix#scaleBy
	 * @param {module:LinearAlgebra.Complex} s The complex number this complex dense matrix is scaled by.
	 */
	scaleBy(s: { data: any; }) : void{
		this.data.scaleBy(s.data);
	}

	/**
	 * Returns A + B
	 * @method module:LinearAlgebra.ComplexDenseMatrix#plus
	 * @param {module:LinearAlgebra.ComplexDenseMatrix} B The complex dense matrix added to this complex dense matrix.
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	plus(B: { data: any; }) : ComplexDenseMatrix{
		return new ComplexDenseMatrix(this.data.plus(B.data));
	}

	/**
	 * Returns A - B
	 * @method module:LinearAlgebra.ComplexDenseMatrix#minus
	 * @param {module:LinearAlgebra.ComplexDenseMatrix} B The complex dense matrix subtracted from this
	 * complex dense matrix.
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	minus(B: { data: any; }) : ComplexDenseMatrix{
		return new ComplexDenseMatrix(this.data.minus(B.data));
	}

	/**
	 * Returns A * s
	 * @method module:LinearAlgebra.ComplexDenseMatrix#timesComplex
	 * @param {module:LinearAlgebra.Complex} s The complex number this complex dense matrix is multiplied by.
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	timesComplex(s: { data: any; }) : ComplexDenseMatrix{
		return new ComplexDenseMatrix(this.data.timesComplex(s.data));
	}

	/**
	 * Returns A * B
	 * @method module:LinearAlgebra.ComplexDenseMatrix#timesDense
	 * @param {module:LinearAlgebra.ComplexDenseMatrix} B The complex dense matrix this complex dense matrix
	 * is multiplied by.
	 * @returns {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	timesDense(B: { data: any; }): ComplexDenseMatrix {
		return new ComplexDenseMatrix(this.data.timesDense(B.data));
	}

	/**
	 * Returns -A
	 * @method module:LinearAlgebra.ComplexDenseMatrix#negated
	 * @return {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	negated() : ComplexDenseMatrix{
		return new ComplexDenseMatrix(this.data.negated());
	}

	/**
	 * Returns A(i, j)
	 * @method module:LinearAlgebra.ComplexDenseMatrix#get
	 * @param {number} i The ith row of this complex dense matrix.
	 * @param {number} j The jth column of this complex dense matrix.
	 * @return {module:LinearAlgebra.Complex}
	 */
	get(i: number, j = 0) : Complex{
		let u = this.data.get(i, j);
		return new Complex(u);
	}

	/**
	 * A(i, j) = x
	 * @method module:LinearAlgebra.ComplexDenseMatrix#set
	 * @param {module:LinearAlgebra.Complex} x The complex value the (i, j)th entry of this complex dense
	 * matrix is set to.
	 * @param {number} i The ith row of this complex dense matrix.
	 * @param {number} j The jth column of this complex dense matrix.
	 */
	set(x: { data: any; }, i: any, j = 0): void{
		this.data.set(i, j, x.data);
	}

	/**
	 * Concatenates two complex dense matrices horizontally.
	 * @method module:LinearAlgebra.ComplexDenseMatrix#hcat
	 * @param {module:LinearAlgebra.ComplexDenseMatrix} B The complex dense matrix that is concatenated horizontally
	 * with this complex dense matrix.
	 * @return {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	hcat(B: { data: any; }): ComplexDenseMatrix{
		return new ComplexDenseMatrix(this.data.hcat(B.data));
	}

	/**
	 * Concatenates two complex dense matrices vertically.
	 * @method module:LinearAlgebra.ComplexDenseMatrix#vcat
	 * @param {module:LinearAlgebra.ComplexDenseMatrix} B The complex dense matrix that is concatenated vertically
	 * with this complex dense matrix.
	 * @return {module:LinearAlgebra.ComplexDenseMatrix}
	 */
	vcat(B: { data: any; }) : ComplexDenseMatrix{
		return new ComplexDenseMatrix(this.data.vcat(B.data));
	}
}
