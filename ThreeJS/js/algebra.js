/**
 * The plan is to implement this leveraging node C++ addons
 * This is more of a reference than anything
 * */
let additionTest = new ArrayBuffer([[1,0], [0,1]]);

function addition ( vectors ) {
    //subtraction is just addition
    // i,j = 0; size = m*n; Sigma( v1(i,j) + v2(i,j) +...+ vn(i,j) )
    let sumVector = vectors[0].map(function (na, i) {

                let sum = vectors.reduce( function (p, na, j) {

                    return p + vectors[j][i];

                }, 0);

                return sum;
            });

    return sumVector;    
}
;

function multiplication ( vectors ) {

    // i,j = 0; size = m*n; Sigma( v1(i,j) * v2(i,j) *...* vn(i,j) )
    let productVector = vectors[vectors.length - 1].map(function (na, i, array) {

                let product = vectors.reduceRight( function (p, na, j, array) {

                    return p * vectors[j][i];

                }, 1);

                return product;
            });

            return addition(productVector);
}

let resultantVector = multiplication(additionTest);console.log(resultantVector);