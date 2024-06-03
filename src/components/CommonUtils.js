export const onComma = (val) => {
    if(!val) return '0';
    val = val.toString().replace(/^0*(\d+)/, '$1').replace(/[^0-9]/g, '');
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}