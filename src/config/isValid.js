let isValid;
export default isValid = (who, any) => {
    let msg = [],
        msgs = {};

    if (who === 'id' && typeof any !== 'string') {
        msg['error'] = 'Silahkan masukkan id yang Valid';
    }

    if (who === 'owner' || who === 'category') {
        Object.entries(any).forEach(([k, v], i) => {
            if (v === undefined) msg.push(`Parameter ${k.toUpperCase()} masih kosong. Mohon isi ${k} terlebih dahulu!!`);
            if (typeof v !== 'string') msg.push(`Type data yang kamu masukkan salah. Mohon isi ${k.toUpperCase()} dengan tipe data STRING`);
        });
        msg.map((e, i) => (msgs[`error_${i + 1}`] = e));
    }
    if (who === 'product') {
        Object.entries(any).forEach(([k, v], i) => {
            if (v === undefined && (k === 'categoryId' || k === 'ownerId')) msg.push(`Parameter ${k} masih kosong. Mohon isi ${k} terlebih dahulu!`);
            if (k === 'price' && typeof v !== 'number') msg.push(`Type data PRICE yang kamu masukkan salah. Mohon isi PRICE dengan tipe data NUMBER`);
        });
        msg.map((e, i) => (msgs[`error_${i + 1}`] = e));
    }
    return msgs;
};
