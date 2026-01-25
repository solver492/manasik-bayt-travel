-- Migration: Ajout du champ isVisible aux offres
-- Date: 2026-01-25

-- Ajouter la colonne isVisible avec une valeur par défaut de true
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true;

-- Mettre à jour toutes les offres existantes pour qu'elles soient visibles
UPDATE offers SET is_visible = true WHERE is_visible IS NULL;
