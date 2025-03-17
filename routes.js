const express = require('express');
const client = require('./db');
const router = express.Router();

// get all parcels
router.get('/parcels', async(req, res) => {
    const query = 'SELECT * FROM parcels';

    try{
        const result = await client.query(query);
        console.log(result)
        res.send(result.rows);
    } catch(err){
        console.log(err.stack)
    }
});

// post a new parcel
router.post('/parcels', async(req, res) => {
    let date = (req.body.date) ? req.body.date : null;
    let platform = (req.body.platform) ? req.body.platform : null;
    let street = (req.body.street) ? req.body.street : null;
    let housenumber = (req.body.housenumber) ? req.body.housenumber : null;
    let plz = (req.body.plz) ? req.body.plz : null;
    let ort = (req.body.ort) ? req.body.ort : null;
    let firstname = (req.body.firstname) ? req.body.firstname : null;
    let lastname = (req.body.lastname) ? req.body.lastname : null;
    let parcelwidth = (req.body.parcelwidth) ? req.body.parcelwidth : null;
    let parcellength = (req.body.parcellength) ? req.body.parcellength : null;
    let parcelheight = (req.body.parcelheight) ? req.body.parcelheight : null;
    let weightinkg = (req.body.weightinkg) ? req.body.weightinkg : null;
    let parcelcontent = (req.body.parcelcontent) ? req.body.parcelcontent : null;

    const query = 'INSERT INTO parcels(date, platform, street, housenumber, plz, ort, firstname, lastname, parcelwidth, parcellength, parcelheight, weightInKg, parcelcontent) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *';
    const values = [date, platform, street, housenumber, plz, ort, firstname, lastname, parcelwidth, parcellength, parcelheight, weightinkg, parcelcontent];

    try{
        const result = await client.query(query, values);
        console.log(result)
        res.send(result.rows[0]);
    } catch(err){
        console.log(err.stack)
    }
});

// get a single parcel
router.get('/parcels/:id', async(req, res) => {
    const query = 'SELECT * FROM parcels WHERE id = $1';

    try{
        const id = req.params.id;
        const result = await client.query(query, [id]);
        console.log(result)
        if (result.rowCount == 1)
            res.send(result.rows[0]);
        else
            res.send({message: "No parcel found with id=" + id})
    }
    catch(err){
        console.log("error", err.stack)
    }
});

//update a parcel
router.put('/parcels/:id', async(req, res) => {
    const query = 'SELECT * FROM parcels WHERE id = $1';

    let id = req.params.id;
    const result = await client.query(query, [id]);
    if(result.rowCount > 0){
        let parcel = result.rows[0];
        date = (req.body.date) ? req.body.date : parcel.date;
        platform = (req.body.platform) ? req.body.platform : parcel.platform;
        street = (req.body.street) ? req.body.street : parcel.street;
        housenumber = (req.body.housenumber) ? req.body.housenumber : parcel.housenumber;
        plz = (req.body.plz) ? req.body.plz : parcel.plz;
        ort = (req.body.ort) ? req.body.ort : parcel.ort;
        firstname = (req.body.firstname) ? req.body.firstname : parcel.firstname;
        lastname = (req.body.lastname) ? req.body.lastname : parcel.lastname;
        parcelwidth = (req.body.parcelwidth) ? req.body.parcelwidth : parcel.parcelwidth;
        parcellength = (req.body.parcellength) ? req.body.parcellength : parcel.parcellength;
        parcelheight = (req.body.parcelheight) ? req.body.parcelheight : parcel.parcelheight;
        weightinkg = (req.body.weightinkg) ? req.body.weightinkg : parcel.weightinkg;
        parcelcontent = (req.body.parcelcontent) ? req.body.parcelcontent : parcel.parcelcontent;

        const updatequery = `UPDATE parcels SET 
        date=$1, 
        platform=$2, 
        street=$3, 
        housenumber=$4, 
        plz=$5, 
        ort=$6, 
        firstname=$7, 
        lastname=$8, 
        parcelwidth=$9,
        parcellength=$10,
        parcelheight=$11,
        weightinkg=$12, 
        parcelcontent=$13,
        WHERE id=$12;`;
        const updateresult = await client.query(updatequery, [date, platform, street, housenumber, plz, ort, firstname, lastname, parcelwidth, parcellength, parcelheight, weightinkg, parcelcontent, id]);
        console.log(updateresult)
        res.send({id, date, platform, street, housenumber, plz, ort, firstname, lastname, parcelwidth, parcellength, parcelheight, weightinkg, parcelcontent});
    }
    else{
        res.status(404)
        res.send({message: "No parcel found with id=" + id})
    }});

//delete a parcel via id
router.delete('/parcels/:id', async(req, res) => {
    const query = 'DELETE FROM parcels WHERE id = $1';

    try{
        const id = req.params.id;
        const result = await client.query(query, [id]);
        console.log(result)
        if (result.rowCount == 1)
            res.send({message: "Parcel with id=" + id + " deleted successfully"});
        else
            res.status(404)
            res.send({message: "No parcel found with id=" + id});
        }
    catch(err){
        console.log("error", err.stack)
    }
});

module.exports = router;