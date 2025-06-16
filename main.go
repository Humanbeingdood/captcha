package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	loginpb "my-app/proto/login"
	"net/http"

	//"os"
	"time"

	"github.com/gin-gonic/gin"
	"google.golang.org/protobuf/proto"
)

const recaptchaSecret = "6Lc1hFsrAAAAANo6jgCPhN8YEVV7sX6DTLtVd93C"

type Response struct {
	Success     bool     `json:"success"`
	ChallengeTS string   `json:"challenge_ts"`
	Hostname    string   `json:"hostname"`
	Errorcodes  []string `json:"error-codes"`
}

func verifyCaptcha(token string) (bool, error) {
	send := "secret=" + recaptchaSecret + "&response=" + token

	start := time.Now()

	response, err := http.Post("https://www.google.com/recaptcha/api/siteverify", "application/x-www-form-urlencoded",
		bytes.NewBufferString(send),
	)

	duration := time.Since(start)

	if err != nil {
		fmt.Println("POST error:", err)
		return false, err
	}
	defer response.Body.Close()

	fmt.Println("response time:", duration)

	body, _ := io.ReadAll(response.Body)
	fmt.Println("response:", string(body))

	var captchaResp Response
	if err := json.Unmarshal(body, &captchaResp); err != nil {
		return false, err
	}

	return captchaResp.Success, nil
}

func main() {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.POST("/login", func(c *gin.Context) {
		raw, err := io.ReadAll(c.Request.Body)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "cannot read"})
			return
		}

		var input loginpb.LoginRequest
		if err := proto.Unmarshal(raw, &input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid protobuf"})
			return
		}

		/*
			payload, err := proto.Marshal(&input)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed payload"})
				return
			}

			filename := fmt.Sprintf("payloads/%s.pb", input.Token)
			err = os.WriteFile(filename, payload, 0644)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "payload save fail"})
				return
			}

		*/

		ok, err := verifyCaptcha(input.Token)
		if err != nil || !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Captcha verification failed"})
			return
		}

		fmt.Println("User ID:", input.UserID)
		fmt.Println("Password:", input.Password)
		fmt.Println("Token:", input.Token)

		resp := &loginpb.Response{
			Status: "login successful",
			UserID: input.UserID,
		}
		out, err := proto.Marshal(resp)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to encode"})
			return
		}
		c.Data(http.StatusOK, "application/octet-stream", out)
	})

	r.Run(":8080")
}
