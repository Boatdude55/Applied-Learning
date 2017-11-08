$("button[name='insertBtn']").click( function () {

        let matrixInsert = $( this ).parents( "div" ).filter( ".matrixContainer" );
        let insertType = $(this).parent().attr( "class" );

        matrixInsert = matrixInsert.find( ".matrix" );

        let rowsInsert = matrixInsert[0].rows;

        switch ( insertType ) {

                case 'colControls' :

                        for ( let i=0; i<rowsInsert.length; i++ ) {

                                rowsInsert[i].insertCell().innerHTML = "<input type='text' name=''>";

                        }
                        break;

                case 'rowControls' :

                        let newRow = matrixInsert[0].insertRow(-1);

                        let numCells = rowsInsert[0].cells.length;

                        for ( let i=0; i< numCells; i++ ) {

                                newRow.insertCell(-1).innerHTML = "<input type='text' name=''>";

                        }

                         break;

        }
});

$( "button[name='rmvBtn']" ).click( function () {

        let matrixRmv = $( this ).parents( "div" ).filter( ".matrixContainer" );
        let deleteType = $(this).parent().attr( "class" );

        matrixRmv = matrixRmv.find(".matrix");

        let rowsRmv = matrixRmv[0].rows;

        switch ( deleteType ) {

                case 'colControls' :

                        for ( let i=0; i<rowsRmv.length; i++ ) {

                                rowsRmv[i].deleteCell(-1);

                        }

                        break;

                case 'rowControls' :

                        matrixRmv[0].deleteRow(-1);

                         break;

        }

});

$( "button[id='addMatrices']" ).click( function () {

        let domCheckSolution = $( "div[class='solutionContainer']" );

        let matricesAdd = $( "table[class='matrix']" );

        let matrixA = matricesAdd[0];
        let matrixB = matricesAdd[1];
        let op = this.innerHTML;

        let definedOp = dimensionCheck( matrixA, matrixB, op );

        let rows = matrixA.rows.length;
        let columns = matrixA.rows[0].cells.length;

        let solutionArray = matrixAdder( matrixA, matrixB, definedOp );

        solutionHandler(rows, columns, solutionArray, domCheckSolution );

});

function matrixAdder ( A, B, defined ) {

        let resultArray = [];

        if ( defined === true ) {

                //Implement: Summation(ij)( A(ij) + B(ij) = C(k))
                let currA, currB;

                for ( let i=0; i< A.rows.length; i++) {

                        for ( let j=0; j< A.rows[0].cells.length; j++ ) {

                                currA = A.rows[i].cells[j].firstChild.value;
                                currB = B.rows[i].cells[j].firstChild.value;

                                currA = Number(currA);
                                currB = Number(currB);
                                resultArray.push(currA + currB);

                        }

                }

                return resultArray;

        } else {

                alert("undefined operation: Check matrix dimensions ");

        }

}

function solutionHandler ( mDimension, nDimension, solution, solutionElem ) {

        let area = $( "div[id='matricesContainer']" );
        //let body = $( "body" )

        let solutionMatrixHTML = "<div class='solutionContainer'><table class='matrix'><tbody>";
        let tr = "";

        let index;

        if ( (mDimension * nDimension) === solution.length ) {
                for ( let i=0; i< mDimension; i++ ) {

                        tr += '<tr>';

                        for ( let j=0; j< nDimension; j++ ) {

                                index = ( mDimension * i ) + j;

                                tr += '<td>' + solution[index] + '</td>';

                        }

                        tr += '</tr>';
                }

                solutionMatrixHTML += tr + '</tbody></table></div>';

        } else {

                alert('Cant map solution  R('+ solution.length +  ') to matrix R('+ mDimension*nDimension + ')');
        }
        if ( solutionElem === undefined ) {

                area.after(solutionMatrixHTML);

        } else {

                solutionElem.remove();

                area.after(solutionMatrixHTML);

        }

}

$( "button[id='subtractMatrices']" ).click( function () {

   let matricesSubtract = $( "table[class='matrix']" );

});

function dimensionCheck ( A, B, operation ) {

        //A: m x n
        //B: p x k
        //add m=p & n=k
        //subtract m=p & n=k

        let dimensionsA = A.rows;
        let dimensionsB = B.rows;

        //entries
        let m = dimensionsA.length;
        let p = dimensionsB.length;

        //unknowns
        let n = dimensionsA[0].cells.length;
        let k = dimensionsB[0].cells.length;

        switch ( operation ) {

                 case '+':
                        if( m === p && n === k) {

                                return true;

                        }
                        break;

                case '-':
                        if( m === p && n === k ) {

                                return true;

                        }
                        break;

        }

}

$( "button[name='clearBtn']" ).click( function () {

        let matrix = $( this ).parents( "div" ).filter( ".matrixContainer" );

        matrix = matrix.find( ".matrix" );

        let matrixCleaner = matrix[0].rows;

        for ( let i=0; i< matrixCleaner.length; i++ ) {

                for ( let j=0; j< matrixCleaner[0].cells.length; j++ ) {

                        matrixCleaner[i].cells[j].firstChild.value = '';

                }

        }

});


