const sampleSchema = {
  "type": "object",
  "properties": {
    "can_1": {
      "title": "CAN CHANNEL 1",
      "$ref": "#/definitions/can"
    }
  },
  "definitions": {
    "can": {
      "type": "object",
      "properties": {
        "phy": {
          "title": "Physical",
          "description": "XYZ",
          "type": "object",
          "properties": {
            "bit_rate_cfg_mode": {
              "title": "Sub title",
              "description": "XYZ",
              "type": "integer",
              "default": 0,
              "anyOf": [
                {
                  "title": "Auto-detect",
                  "enum": [
                    0
                  ]
                },
                {
                  "title": "Bit-rate (simple)",
                  "enum": [
                    1
                  ]
                },
                {
                  "title": "Bit-timing (advanced)",
                  "enum": [
                    2
                  ]
                }
              ]
            }
          },
          "dependencies": {
            "bit_rate_cfg_mode": {
              "oneOf": [
                {
                  "properties": {
                    "bit_rate_cfg_mode": {
                      "enum": [
                        0
                      ]
                    }
                  }
                },
                {
                  "properties": {
                    "bit_rate_cfg_mode": {
                      "enum": [
                        1
                      ]
                    },
                    "bit_rate_std": {
                      "title": "Bit-rate standard",
                      "type": "integer",
                      "default": 250000,
                      "anyOf": [
                        {
                          "title": "5K",
                          "enum": [
                            5000
                          ]
                        },
                        {
                          "title": "10K",
                          "enum": [
                            10000
                          ]
                        },
                        {
                          "title": "20K",
                          "enum": [
                            20000
                          ]
                        },
                        {
                          "title": "33.333K",
                          "enum": [
                            33333
                          ]
                        },
                        {
                          "title": "47.619K",
                          "enum": [
                            47619
                          ]
                        },
                        {
                          "title": "50K",
                          "enum": [
                            50000
                          ]
                        },
                        {
                          "title": "83.333K",
                          "enum": [
                            83333
                          ]
                        },
                        {
                          "title": "95.238K",
                          "enum": [
                            95238
                          ]
                        },
                        {
                          "title": "100K",
                          "enum": [
                            100000
                          ]
                        },
                        {
                          "title": "125K",
                          "enum": [
                            125000
                          ]
                        },
                        {
                          "title": "250K",
                          "enum": [
                            250000
                          ]
                        },
                        {
                          "title": "500K",
                          "enum": [
                            500000
                          ]
                        },
                        {
                          "title": "800K",
                          "enum": [
                            800000
                          ]
                        },
                        {
                          "title": "1M",
                          "enum": [
                            1000000
                          ]
                        }
                      ]
                    },
                    "bit_rate_fd": {
                      "title": "Bit-rate FD",
                      "type": "integer",
                      "default": 1000000,
                      "anyOf": [
                        {
                          "title": "1M",
                          "enum": [
                            1000000
                          ]
                        },
                        {
                          "title": "2M",
                          "enum": [
                            2000000
                          ]
                        },
                        {
                          "title": "4M",
                          "enum": [
                            4000000
                          ]
                        }
                      ]
                    }
                  }
                },
                {
                  "properties": {
                    "bit_rate_cfg_mode": {
                      "enum": [
                        2
                      ]
                    },
                    "brp": {
                      "title": "BRP (Bit Rate Prescaler)",
                      "type": "integer",
                      "default": 12,
                      "minimum": 1
                    },
                    "seg1": {
                      "title": "SEG1 (Time Segment 1 )",
                      "type": "integer",
                      "default": 63,
                      "minimum": 1
                    },
                    "seg2": {
                      "title": "SEG2 (Time Segment 2)",
                      "type": "integer",
                      "default": 16,
                      "minimum": 2
                    },
                    "sjw": {
                      "title": "SJW (Synchronization Jump Width)",
                      "type": "integer",
                      "default": 4,
                      "minimum": 0,
                      "maximum": 4
                    }
                  }
                }
              ]
            }
          }
        }
      }
    }
  }
};

export default sampleSchema;