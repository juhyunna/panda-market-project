const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 상품 목록 조회 (페이지네이션, 검색, 정렬)
router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword = '', orderBy = 'recent' } = req.query;
    
    // 검색 조건
    const searchCondition = {};
    if (keyword) {
      searchCondition.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    // 정렬 조건
    let sortCondition = {};
    if (orderBy === 'recent') {
      sortCondition = { createdAt: -1 };
    } else if (orderBy === 'favorite') {
      sortCondition = { favoriteCount: -1 };
    }
    
    // 페이지네이션 계산
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    
    // 상품 조회
    const products = await Product.find(searchCondition)
      .select('id name price createdAt')
      .sort(sortCondition)
      .skip(skip)
      .limit(parseInt(pageSize));
    
    // 전체 개수 조회
    const totalCount = await Product.countDocuments(searchCondition);
    
    res.json({
      list: products,
      totalCount,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(totalCount / parseInt(pageSize))
    });
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 상품 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('상품 상세 조회 실패:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 상품 등록
router.post('/', async (req, res) => {
  try {
    const { name, description, price, tags, images = [] } = req.body;
    
    // 필수 필드 검증
    if (!name || !description || !price || !tags) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }
    
    const product = new Product({
      name,
      description,
      price: parseInt(price),
      tags,
      images
    });
    
    const savedProduct = await product.save();
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('상품 등록 실패:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 상품 수정
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('상품 수정 실패:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 상품 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }
    
    res.json({ message: '상품이 삭제되었습니다.' });
  } catch (error) {
    console.error('상품 삭제 실패:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
