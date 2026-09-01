require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");

const User = require("../models/User");
const Asset = require("../models/Asset");
const Complaint = require("../models/Complaint");
const Counter = require("../models/Counter");

const seed = async () => {

    try {

        await connectDB();

        console.log("Connected to MongoDB");

        await User.deleteMany();
        await Asset.deleteMany();
        await Complaint.deleteMany();
        await Counter.deleteMany();

        const employeePassword = await bcrypt.hash("Employee@123",10);
        const adminPassword = await bcrypt.hash("Admin@123",10);
        const techPassword = await bcrypt.hash("Tech@12345",10);

        const admin = await User.create({

            userId:"ADM001",

            name:"R. Kumar",

            email:"admin@company.com",

            password:adminPassword,

            department:"Administration",

            role:"admin",

            mobile:"9876500011"

        });

        const employee = await User.create({

            userId:"EMP001",

            name:"Ananya Rao",

            email:"employee@company.com",

            password:employeePassword,

            department:"Information Technology",

            role:"employee",

            mobile:"9876543210"

        });

        const technician = await User.create({

            userId:"TEC001",

            name:"Vikram Singh",

            email:"tech@company.com",

            password:techPassword,

            department:"IT Support",

            role:"technician",

            mobile:"9876500022"

        });

        const asset = await Asset.create({

            assetId:"AST-1001",

            assetName:"Dell Latitude 5440",

            category:"Laptop",

            brand:"Dell",

            purchaseDate:new Date("2025-04-12"),

            warrantyExpiry:new Date("2028-04-11"),

            assignedEmployee:"Ananya Rao"

        });

        await Complaint.create({

            complaintId:"CMP-2026-001",

            employee:employee._id,

            employeeId:employee.userId,

            employeeName:employee.name,

            department:employee.department,

            asset:asset._id,

            assetId:asset.assetId,

            assetName:asset.assetName,

            category:"Laptop",

            description:"Laptop battery drains within thirty minutes and shuts down during meetings.",

            priority:"High",

            status:"Assigned",

            technician:technician._id,

            technicianId:technician.userId,

            technicianName:technician.name,

            adminRemarks:"Battery diagnostics required.",

            resolutionNotes:"",

            history:[

                {

                    action:"Complaint Created",

                    performedBy:employee.name

                },

                {

                    action:"Assigned to Technician",

                    performedBy:admin.name

                }

            ]

        });

        await Counter.insertMany([
            { _id: "ADM", sequenceValue: 1 },
            { _id: "EMP", sequenceValue: 1 },
            { _id: "TEC", sequenceValue: 1 },
            { _id: "ASSET", sequenceValue: 1 },
            { _id: "COMPLAINT_2026", sequenceValue: 1 }
        ]);

        console.log("Database Seeded Successfully");

        process.exit();

    }

    catch(error){

        console.log(error);

        process.exit(1);

    }

};

seed();
