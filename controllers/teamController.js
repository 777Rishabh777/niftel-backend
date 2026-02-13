const Team = require('../models/Team');
const path = require('path');
const fs = require('fs');

exports.getAllTeamMembers = async (req, res) => {
    try {
        const teamMembers = await Team.findAll({
            where: { active: true },
            order: [['order', 'ASC']]
        });
        res.json(teamMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeamMember = async (req, res) => {
    try {
        const teamMember = await Team.findByPk(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(teamMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create team member
exports.createTeamMember = async (req, res) => {
    try {
        const teamData = {
            name: req.body.name,
            position: req.body.position,
            photo: req.file ? `/uploads/${req.file.filename}` : '',
            email: req.body.email,
            phone: req.body.phone,
            bio: req.body.bio,
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            linkedin: req.body.linkedin,
            instagram: req.body.instagram,
            order: req.body.order || 0,
            active: req.body.active !== undefined ? req.body.active : true
        };

        const savedTeamMember = await Team.create(teamData);
        res.status(201).json(savedTeamMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update team member
exports.updateTeamMember = async (req, res) => {
    try {
        const teamMember = await Team.findByPk(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        const updateData = {};
        
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.position !== undefined) updateData.position = req.body.position;
        if (req.body.email !== undefined) updateData.email = req.body.email;
        if (req.body.phone !== undefined) updateData.phone = req.body.phone;
        if (req.body.bio !== undefined) updateData.bio = req.body.bio;
        if (req.body.facebook !== undefined) updateData.facebook = req.body.facebook;
        if (req.body.twitter !== undefined) updateData.twitter = req.body.twitter;
        if (req.body.linkedin !== undefined) updateData.linkedin = req.body.linkedin;
        if (req.body.instagram !== undefined) updateData.instagram = req.body.instagram;
        if (req.body.order !== undefined) updateData.order = req.body.order;
        if (req.body.active !== undefined) updateData.active = req.body.active;

        if (req.file) {
            if (teamMember.photo) {
                const oldPhotoPath = path.join(__dirname, '..', teamMember.photo);
                if (fs.existsSync(oldPhotoPath)) {
                    try {
                        fs.unlinkSync(oldPhotoPath);
                    } catch (err) {
                        console.error("Error deleting old photo:", err);
                    }
                }
            }
            updateData.photo = `/uploads/${req.file.filename}`;
        }

        await teamMember.update(updateData);
        
        await teamMember.reload();
        
        res.json(teamMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete team member
exports.deleteTeamMember = async (req, res) => {
    try {
        const teamMember = await Team.findByPk(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        if (teamMember.photo) {
            const photoPath = path.join(__dirname, '..', teamMember.photo);
            if (fs.existsSync(photoPath)) {
                try {
                    fs.unlinkSync(photoPath);
                } catch (err) {
                    console.error("Error deleting photo file:", err);
                }
            }
        }

        await teamMember.destroy();
        res.json({ message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};