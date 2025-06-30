import React from 'react';
import {TableWrapper, Cell} from 'react-native-table-component';
import {tableStyles} from '../../Styles';

const TableRow = ({data, styles, widthArr}) => (
  <TableWrapper
    borderStyle={tableStyles.table}
    style={{...tableStyles.tr, ...styles}}>
    <Cell
      data={data[0]}
      width={widthArr[0]}
      textStyle={tableStyles.centeredTdText}
    />
    <Cell
      data={data[1]}
      width={widthArr[1]}
      textStyle={tableStyles.centeredTdText}
    />
    <Cell data={data[2]} width={widthArr[2]} textStyle={tableStyles.tdText} />
    <Cell
      data={data[3]}
      width={widthArr[3]}
      textStyle={tableStyles.centeredTdText}
    />
  </TableWrapper>
);

export default TableRow;
