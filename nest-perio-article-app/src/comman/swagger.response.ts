import { HttpStatus } from '@nestjs/common';

export const meta = {
  type: 'object',
  properties: {
    totalItems: {
      type: 'integer',
      example: 10,
    },
    itemsPerPage: {
      type: 'integer',
      example: 1,
    },
    // itemCount: {
    //   type: 'integer',
    //   example: 1,
    // },
    totalPages: {
      type: 'integer',
      example: 1,
    },
    currentPage: {
      type: 'integer',
      example: 1,
    },
  },
};

export const BAD_REQUEST_RESPONSE = {
  status: HttpStatus.BAD_REQUEST,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.BAD_REQUEST,
      },
      message: {
        type: 'string',
        example: 'error message',
      },
      error: {
        type: 'string',
        example: 'Bad Request',
      },
    },
  },
};

export const UNAUTHORIZE_RESPONSE = {
  status: HttpStatus.UNAUTHORIZED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.UNAUTHORIZED },
      message: {
        type: 'string',
        example: 'Unauthorized',
      },
    },
  },
};

export const CONFLICT_RESPONSE = {
  status: HttpStatus.CONFLICT,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.CONFLICT,
      },
      message: {
        type: 'string',
        example: 'Conflict error message',
      },
      error: {
        type: 'string',
        example: 'Conflict',
      },
    },
  },
};

export const POST_REQUEST_SUCCESS = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.CREATED,
      },
      message: {
        type: 'string',
        example: 'Resource created',
      },
    },
  },
};

export const PUT_REQUEST_SUCCESS = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.OK,
      },
      message: {
        type: 'string',
        example: 'Success',
      },
    },
  },
};

export const GET_RESPONSE_SUCCESS = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.OK,
      },
      message: {
        type: 'string',
        example: 'Success',
      },
    },
  },
};

export const DELETED_RESPONSE = {
  status: HttpStatus.NO_CONTENT,
  description: 'Category deleted successfully.',
};

const category = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
      example: 1,
    },

    categoryName: {
      type: 'string',
      example: 'Category Name',
    },

    color: {
      type: 'string',
      example: '#FF0000',
    },

    updatedAt: {
      type: 'number',
      example: 1676049232,
    },
  },
};

const article = {
  type: 'object',
  properties: {
    id: { type: 'number', example: 1 },
    title: { type: 'string', example: 'My First Article' },
    content: { type: 'string', example: 'This is the content of the article.' },
    author: { type: 'string', example: 'John Doe' },
    summary: { type: 'string', example: 'summary' },
    abstract: { type: 'string', example: 'abstarct' },
    journal: { type: 'string', example: 'journal' },
    publishedYear: { type: 'string', example: '2024' },
    updatedAt: { type: 'number', example: 1676049232 },
  },
};

export const CATEGORY_CREATED_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Category Created Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: {
        type: 'string',
        example: 'Category created successfully',
      },
      data: category,
    },
  },
};

export const CATEGORY_UPDATED_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response for successful category update',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.OK,
      },
      message: {
        type: 'string',
        example: 'Category updated successfully.',
      },
      data: category,
    },
  },
};

export const CREATE_ARTICLE_SUCCESS_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'New Article Created',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: { type: 'string', example: 'New article created successfully.' },
      data: article,
    },
  },
};

export const ARTICLE_ALREADY_EXISTS_RESPONSE = {
  status: HttpStatus.BAD_REQUEST,
  schema: {
    type: 'object',
    description: 'Article Already Exists',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
      message: { type: 'string', example: 'Article name already exists.' },
      error: { type: 'string', example: 'Bad Request' },
    },
  },
};

export const UPDATE_ARTICLE_SUCCESS_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Article updated successfully',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.OK,
      },
      message: {
        type: 'string',
        example: 'Article updated successfully.',
      },
      data: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Updated Article Title' },
          author: { type: 'string', example: 'Updated Author' },
          summary: { type: 'string', example: 'Updated summary' },
          abstract: { type: 'string', example: 'Updated abstract' },
          journal: { type: 'string', example: 'Updated Journal' },
          published_year: { type: 'string', example: '2024' },
          updatedAt: { type: 'number', example: 1676049232 },
          category: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              categoryName: {
                type: 'string',
                example: 'Updated Category Name',
              },
            },
          },
        },
      },
    },
  },
};
