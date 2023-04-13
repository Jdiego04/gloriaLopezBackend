//Aqui definimos todas las rutas principales donde se usara la aplicación

const express = require('express');

const router = require('express').Router();


router.get('/', (req,res)=>{
    res.send('Hello word');
});

module.exports = router; 